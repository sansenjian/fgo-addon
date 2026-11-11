package upstream

// kejifuwu（fatego.cn）GraphQL 上游适配层
// 我们的后端代持上游账号：SM4 加密密码登录拿 JWT，之后透传 GraphQL 请求，401 自动重登。

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"sync"
	"time"
)

var (
	GraphQLEndpoint = envStr("KEJIFUWU_GRAPHQL_ENDPOINT", "https://graphql.fatego.cn/graphql")
	Username        = envStr("KEJIFUWU_USERNAME", "")
	Password        = envStr("KEJIFUWU_PASSWORD", "")
)

func envStr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

const loginQuery = `mutation ($u: String!, $p: String!) {
  login(userNameOrEmail: $u, password: $p) { token userName }
}`

type gqlErr struct {
	Message string `json:"message"`
}

type loginResponse struct {
	Errors []gqlErr `json:"errors"`
	Data   struct {
		Login struct {
			Token    string `json:"token"`
			UserName string `json:"userName"`
		} `json:"login"`
	} `json:"data"`
}

type Client struct {
	mu   sync.Mutex
	http *http.Client
	token string
}

var Default = &Client{http: &http.Client{Timeout: 30 * time.Second}}

func (c *Client) login() error {
	payload, _ := json.Marshal(map[string]any{
		"query":     loginQuery,
		"variables": map[string]string{"u": Username, "p": sm4EncryptToBase64(Password)},
	})
	resp, err := c.http.Post(GraphQLEndpoint, "application/json", bytes.NewReader(payload))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	var result loginResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return err
	}
	if len(result.Errors) > 0 {
		return errors.New("上游登录失败: " + result.Errors[0].Message)
	}
	c.token = result.Data.Login.Token
	return nil
}

func (c *Client) ensureLogin() error {
	if c.token != "" {
		return nil
	}
	return c.login()
}

// Do 透传 GraphQL 请求体（{"query": "...", "variables": {...}}），自动注入上游 JWT
func (c *Client) Do(graphQLBody []byte) (int, []byte, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if err := c.ensureLogin(); err != nil {
		return 0, nil, err
	}
	status, data, err := c.doOnce(graphQLBody)
	if err != nil {
		return 0, nil, err
	}
	if status == http.StatusUnauthorized {
		c.token = ""
		if err := c.login(); err != nil {
			return status, data, err
		}
		status, data, err = c.doOnce(graphQLBody)
	}
	return status, data, err
}

func (c *Client) doOnce(body []byte) (int, []byte, error) {
	req, err := http.NewRequest(http.MethodPost, GraphQLEndpoint, bytes.NewReader(body))
	if err != nil {
		return 0, nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/graphql-response+json, application/json")
	if c.token != "" {
		req.Header.Set("Authorization", "Bearer "+c.token)
	}
	resp, err := c.http.Do(req)
	if err != nil {
		return 0, nil, err
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	return resp.StatusCode, data, err
}
