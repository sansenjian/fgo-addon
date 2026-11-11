package upstream

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/cookiejar"
	"os"
	"sync"
	"time"
)

// 上游 = kejifuwu（我们自己的账号），相当于 new-api 里的"渠道"
// 所有值均可通过环境变量覆盖，等浏览器抓包确认真实路径后再调整
var (
	BaseURL    = env("KEJIFUWU_BASE_URL", "https://kejifuwu.windycloud.cn")
	Username   = env("KEJIFUWU_USERNAME", "")
	Password   = env("KEJIFUWU_PASSWORD", "")
	APIPrefix  = env("KEJIFUWU_API_PREFIX", "/api") // 上游业务接口前缀（抓包确认）
	LoginPath  = env("KEJIFUWU_LOGIN_PATH", "/api/user/login") // one-api 系约定，抓包确认
)

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

type Client struct {
	mu     sync.Mutex
	http   *http.Client
	token  string // 若上游返回 JWT/token 则缓存；若走 cookie 则由 Jar 自动携带
}

var Default = New()

func New() *Client {
	jar, _ := cookiejar.New(nil)
	return &Client{
		http: &http.Client{
			Jar:     jar,
			Timeout: 30 * time.Second,
		},
	}
}

var ErrLogin = errors.New("上游账号登录失败")

type loginResp struct {
	Success bool   `json:"success"`
	Msg     string `json:"msg"`
	Data    struct {
		Token string `json:"token"`
	} `json:"data"`
}

func (c *Client) login() error {
	payload, _ := json.Marshal(map[string]string{
		"username": Username,
		"password": Password,
	})
	req, err := http.NewRequest(http.MethodPost, BaseURL+LoginPath, bytes.NewReader(payload))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var result loginResp
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return err
	}
	if !result.Success {
		return ErrLogin
	}
	c.token = result.Data.Token // cookie 已由 Jar 保存，token 可能为空（纯 cookie 模式）
	return nil
}

func (c *Client) ensureLogin() error {
	if c.token != "" {
		return nil
	}
	return c.login()
}

func (c *Client) doOnce(method, path string, body []byte) (int, string, []byte, error) {
	var reader io.Reader
	if body != nil {
		reader = bytes.NewReader(body)
	}
	req, err := http.NewRequest(method, BaseURL+path, reader)
	if err != nil {
		return 0, "", nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	if c.token != "" {
		// one-api/new-api 风格：Authorization 直接放 token（不带 Bearer 前缀也可，视上游而定）
		req.Header.Set("Authorization", c.token)
	}
	resp, err := c.http.Do(req)
	if err != nil {
		return 0, "", nil, err
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	return resp.StatusCode, resp.Header.Get("Content-Type"), data, err
}

// Do 发起上游请求；401 时自动重登并重试一次（会话过期兜底，同 new-api 渠道重试逻辑）
func (c *Client) Do(method, path string, body []byte) (int, string, []byte, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if err := c.ensureLogin(); err != nil {
		return 0, "", nil, err
	}
	status, contentType, data, err := c.doOnce(method, path, body)
	if err != nil {
		return 0, "", nil, err
	}
	if status == http.StatusUnauthorized {
		c.token = ""
		if err := c.login(); err != nil {
			return status, contentType, data, err
		}
		status, contentType, data, err = c.doOnce(method, path, body)
	}
	return status, contentType, data, err
}
