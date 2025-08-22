---
title: 如何配置Nginx
order: 1
category: 编程文章
tags:
  - 前端
  - Nginx
icon: n
date: 2025-04-28
---

Nginx的配置一般放在其安装目录下的`conf/nginx.conf`中，其大致结构如下：

<!-- more -->

```nginx :no-collapsed-lines :no-line-numbers {16-23,26-42} title="nginx.conf"
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;

    # gzip 相关配置
    gzip  on;
    gzip_min_length  256;
    gzip_buffers     4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 2;
    gzip_types text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml text/javascript application/javascript application/x-javascript text/x-json application/json application/x-web-app-manifest+json text/css text/plain text/x-component font/opentype application/x-font-ttf applicationn/vnd.ms-fontobject image/x-icon;
    gzip_disable "MSIE [1-6]\.";
    gzip_vary on;

    # server 相关配置
    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
            access_log /var/log/nginx/access.log;
        }

        error_page   404              /404.html;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

接下来，我们将两段高亮的内容详细介绍一下。

## gzip 配置

在浏览器中按 F12 打开开发者工具，在“网络”页签，随便选择一条请求，我们可以找到请求标头：

```http :no-line-numbers {3}
GET / HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: zh-CN,zh;q=0.9
......
```

上述内容只是举个例子，具体内容因浏览器而异。我们主要关注`Accept-Encoding`这一行，这表示浏览器告诉服务器：“我支持以下这些压缩方式，你可以使用任意一种方式将消息压缩后发给我，我自行解压即可。”

可以看到，其中就有一种压缩方式叫做`gzip`。Nginx的`gzip`配置就是用来开启和配置这种压缩方式的：

```nginx :no-line-numbers {2-10}
http {
    gzip  on;               # 开启gzip压缩
    gzip_min_length  256;   # 最小压缩内容大小，小于这个大小的源内容就不进行压缩
    gzip_buffers     4 16k; # 以16k为单位，按照原始数据的大小以4倍的方式申请内存空间
    gzip_http_version 1.1;  # 压缩版本
    gzip_comp_level 2;      # 压缩等级，越低则效率越高，但对于CPU的性能负载也会越高
    # gzip_types 用于配置需要压缩的类型
    gzip_types text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml text/javascript application/javascript application/x-javascript text/x-json application/json application/x-web-app-manifest+json text/css text/plain text/x-component font/opentype application/x-font-ttf applicationn/vnd.ms-fontobject image/x-icon;
    gzip_disable "MSIE [1-6]\."; # 禁止微软的IE6浏览器进行压缩（因为IE6有bug）
    gzip_vary on;
}
```

注释非常清晰，就不赘述了。

这样一来，浏览器访问Nginx服务器时，就会自动使用gzip进行压缩和解压，从而大大减小传输内容的体积。

## server 配置

在`http`下方可以配置多个`server`，`server`下面支持非常多的配置，解释起来也很复杂，因此下文将以不同的常用场景为例分别进行说明。

::: tip 小知识

在浏览器中输入`http://ip或域名:端口号/`时，会使用 http 协议访问该ip或域名的指定端口号。

如果省略了`:端口号`，则会使用默认端口号：
- http 的默认端口号是 80
- https 的默认端口号是 443

:::

### 用作普通的 http 服务器

最基础的配置如下：

```nginx :no-line-numbers :no-collapsed-lines
http {
    server {
        listen       80;        # 监听的端口号
        server_name  localhost; # 域名
        
        charset utf-8; # 编码
    
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            access_log /var/log/nginx/access.log;
        }
        
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

`listen`后配的是监听的端口号，`server_name`后配的是域名。这里就涉及到域名解析的问题了。

当我们购买了一个域名后，在域名管理后台可以配置域名解析，将其解析到某个ip，这个域名解析的映射会同步到专门的DNS服务器。当用户访问这个域名时，会去DNS服务器查询它对应的ip，并最终访问这个ip。很显然，这个映射关系是 域名 &rarr; ip 的映射，也就是说，完全可以将多个域名映射到同一个ip。我们正常访问网站时，一般都是不填写端口号的，所以会通过默认端口80访问。这里在Nginx中就可以配置多个`server`，其监听同一个端口，但是`server_name`配置不同的域名。当且仅当使用配置的这个域名来访问时，才会进入这个`server`的配置。

那么就有个新的问题，如果都不匹配怎么办？如果都不匹配，就会使用这个端口的第一个`server`的配置。因此，如果我们想禁止直接通过IP访问，必须通过域名访问，就可以在最前面增加一个默认的`server`，负责进行拦截，而后续的`server`指定域名，进行正确的访问逻辑。

```nginx :no-line-numbers :no-collapsed-lines
http {
    server {
        listen 80 default_server;      # 针对80端口的访问
        listen [::]:80 default_server; # 针对ipv6访问的80端口
        return 404;                    # 直接返回404错误
    }
    # 后续内容
}
```

接下来我们看这一段：

```nginx :no-line-numbers :no-collapsed-lines {5-9}
http {
    server {
        listen       80;        # 监听的端口号
        server_name  localhost; # 域名
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            access_log /var/log/nginx/access.log;
        }
    }
}
```

这一段代码中的高亮部分表示将本地目录 `/usr/share/nginx/html` 下的文件映射到 `http://localhost/` 链接进行访问，如果想要使用子链接就将其改为`location /example/`。`index`用来配置默认主页，当用户直接访问 `http://localhost/` ，其后不带具体的文件名时，就会尝试访问`index`后配置的默认文件。`access_log`用来配置访问日志的存储路径。

如果你只是简单地支持访问某个文件夹下的所有内容（例如Node项目打包好的dist目录），按照上述配置稍加修改即可。但如果想要做复杂的配置，则需要详细了解[`location`配置规范](#location-配置)，由于篇幅较长，我将其放在文末。

### https 服务器（SSL认证）

如果想要搭建一个https服务器，首先你需要证书和密钥。你完全可以自行搜索如何生成一个自建证书和密钥，但用户在访问时，浏览器会提示该网站不安全。为了解决这个问题，最好的办法是去申请一个证书，例如前往阿里云或腾讯云申请一个免费证书。如何申请这里就不细讲了。

申请好之后，你会得到一个`.crt`文件和`.key`文件，将其放在你的机器上，并且修改Nginx的配置：

```nginx :no-line-numbers :no-collapsed-lines
http {
    server {
        listen       443 ssl;         # https 要监听443端口
        server_name  www.example.com; # 替换为你的域名
    
        ssl_certificate     /etc/nginx/ssl/example.crt; # 替换为你的 SSL 证书路径
        ssl_certificate_key /etc/nginx/ssl/example.key; # 替换为你的 SSL 私钥路径
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }
    }
}
```

如果需要将 HTTP 自动跳转到 HTTPS，可以加一个 80 端口的重定向：

```nginx :no-line-numbers
http {
    server {
        listen      80;
        server_name www.example.com;
        return 301 https://$host$request_uri;
    }
}
```

::: tip 小知识

301返回码的意思是“重定向”，一般这个返回码会附带返回另一个网址。当浏览器访问收到301返回码时，会自动跳转到返回的网址。

:::

### 用作文件服务器

如果你想将Nginx用作文件服务器，让某个目录下的所有文件都能被直接访问，在`location`下面增加如下三行即可：

```nginx :no-line-numbers {8-10}
http {
    server {
        listen       80;
        server_name  fileserver;
    
        location /files/ {
            root files;
            autoindex on;             # 是否开启目录浏览 [!code ++]
            autoindex_exact_size off; # 是否显示文件距离大小 [!code ++]
            autoindex_localtime on;   # 是否显示文件时间 [!code ++]
        }
    }
}
```

### 服务转发

有的时候，你的http服务的真实端口并不想暴露，打算用Nginx做转发，就可以这样配置：

```nginx :no-line-numbers {3-7}
http {
    server {
        proxy_pass http://localhost:11111; # 将请求转发到你的服务进程
        # 以下三行是为了转发请求头信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 综合例子

我们把上文的内容融合在一起，展示一个完整的配置示例。想象这样一个场景：我打算做一个网站 `http://www.example.com/` ，使用Node工程完成了网站的编写，并打包放在了`dist/`目录下。网站服务不直接监听80端口，而是监听一个别的端口（该端口用防火墙限制只能内部访问），然后使用 Nginx 监听80和443端口进行转发，支持 http 和 https，并禁止使用 ip 直接访问。

```nginx :no-line-numbers title="nginx.conf"
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;

    # gzip 相关配置
    gzip  on;
    gzip_min_length  256;
    gzip_buffers     4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 2;
    gzip_types text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml text/javascript application/javascript application/x-javascript text/x-json application/json application/x-web-app-manifest+json text/css text/plain text/x-component font/opentype application/x-font-ttf applicationn/vnd.ms-fontobject image/x-icon;
    gzip_disable "MSIE [1-6]\.";
    gzip_vary on;
    
    # 禁止ip直接访问
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;
        ssl_certificate     /usr/local/nginx/ssl/dummy.crt;
        ssl_certificate_key /usr/local/nginx/ssl/dummy.key;
        return 404; # 直接返回404
    }
    
    # 配置80端口转发11111端口
    server {
        listen 80;
        server_name example.com www.example.com; # 替换为你的域名
        server_tokens off;
        keepalive_timeout 5;
        # 防盗链，禁止其它网站直接引用本网站的静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|mp4|mp3|woff2?)$ {
            valid_referers none blocked server_names;
            if ($invalid_referer) {
                return 403;
            }
            proxy_pass http://localhost:11111; # 将请求转发到你的服务进程
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location / {
            access_log /var/log/nginx/access-all.log;
            proxy_pass http://localhost:11111; # 将请求转发到你的服务进程
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
    
    # 配置443端口转发11111端口
    server {
        listen 443 ssl;
        server_name example.com www.example.com; # 替换为你的域名
        server_tokens off;
        keepalive_timeout 5;
        ssl_certificate /usr/local/nginx/ssl/example.com_bundle.crt; # 替换为你的 SSL 证书路径
        ssl_certificate_key /usr/local/nginx/ssl/example.com.key; # 替换为你的 SSL 私钥路径
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
        # 防盗链，禁止其它网站直接引用本网站的静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|mp4|mp3|woff2?)$ {
            valid_referers none blocked server_names;
            if ($invalid_referer) {
                return 403;
            }
            proxy_pass http://localhost:11111; # 将请求转发到你的服务进程
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location / {
            access_log /var/log/nginx/access-all.log;
            proxy_pass http://localhost:11111; # 将请求转发到你的服务进程
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # 监听11111端口启动服务
    server {
        listen       11111; # 监听11111端口，此端口由防火墙限制只能内部访问
        server_name  localhost;

        location / {
            root   dist;
            index  index.html index.htm;
            access_log /var/log/nginx/access.log;
        }

        error_page   404              /404.html;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

## location 配置

接下来，我们要详细讲解一下 `location` 配置。这是 Nginx 配置中非常核心且容易混淆的概念。

Nginx 的 `location` 匹配遵循一个清晰的优先级层次结构。**记住一个核心原则：先匹配前缀，再匹配正则，但正则的优先级（一旦匹配）高于普通前缀（除非使用了 `^~` 修饰符）**。

具体优先级从高到低如下：

1.  **`=` 精确匹配**
    *   最高优先级。如果请求的 URI 与 `=` 后的模式完全一致，则立即使用此 location，并停止搜索其他 location。
    *   示例：`location = /login { ... }` 只匹配 `/login` 这个精确的请求。

2.  **`^~` 前缀匹配（停止正则检查）**
    *   如果请求的 URI 与 `^~` 后的模式**开头部分匹配**，Nginx 会立即选择此 location，并且**不再检查后续的任何正则 location**。
    *   它优先于任何正则表达式匹配 (`~` 和 `~*`)。
    *   示例：`location ^~ /static/ { ... }` 匹配任何以 `/static/` 开头的请求（如 `/static/css/style.css`）。

3.  **`~` 和 `~*` 正则表达式匹配（按配置文件中的顺序）**
    *   `~` 表示**区分大小写**的正则匹配。
    *   `~*` 表示**不区分大小写**的正则匹配。
    *   **关键点**：如果有多个正则 location 匹配，Nginx 会**按照它们在配置文件中出现的第一个匹配的正则规则**来选择，并立即使用它。
    *   它们的优先级低于 `=` 和 `^~`，但高于普通前缀匹配。

4.  **普通前缀匹配（无修饰符）**
    *   这是最常见的匹配方式，如 `location /images/ { ... }`。
    *   如果有多个普通前缀匹配，Nginx 会选择**最长匹配**的前缀。
    *   但是，**所有普通前缀匹配的优先级都低于任何类型的正则匹配**。这意味着即使一个普通前缀有更长的匹配，只要存在一个能匹配的正则 location，Nginx 就会选择那个正则 location。

### 匹配流程示意图

Nginx 处理一个请求时，选择 location 的逻辑流程可以简化为以下步骤：

```mermaid
flowchart TD
A[收到请求URI] --> B{检查所有<br>前缀location}
B -- 找到精确匹配「=」 --> C[立即使用该location<br>处理请求]
B -- 找到最长普通前缀匹配<br>并记录 --> D{是否存在「^~」匹配？}
D -- 是 --> E[使用该「^~」location<br>（停止正则检查）]
D -- 否 --> F[按顺序检查所有<br>正则location「\~」「~*」]
F -- 找到第一个匹配的正则 --> G[使用该正则location]
F -- 所有正则都不匹配 --> H[使用之前记录的<br>最长普通前缀location]
```

### 示例详解

假设我们有如下配置文件片段：

```nginx :no-line-numbers :no-collapsed-lines
server {
    listen 80;
    server_name example.com;

    # Location 1: 精确匹配
    location = /logo.png {
        return 200 "You hit the exact match for logo.png\n";
    }

    # Location 2: 优先前缀匹配（阻止正则检查）
    location ^~ /static/ {
        return 200 "You hit the static prefix match\n";
    }

    # Location 3: 区分大小写的正则匹配
    location ~ \.php$ {
        return 200 "You hit the PHP regex (case-sensitive)\n";
    }

    # Location 4: 不区分大小写的正则匹配
    location ~* \.html$ {
        return 200 "You hit the HTML regex (case-insensitive)\n";
    }

    # Location 5: 普通前缀匹配（最长匹配规则）
    location /images/ {
        return 200 "You hit the general images prefix match\n";
    }

    # Location 6: 通用捕获（最低优先级）
    location / {
        return 200 "You hit the generic catch-all location\n";
    }
}
```

现在，我们来看各种请求会匹配到哪个 location：

| 请求的 URI                               | 匹配的 Location   | 原因分析                                                                                                       |
|---------------------------------------|----------------|------------------------------------------------------------------------------------------------------------|
| `http://example.com/logo.png`         | **Location 1** | 最高优先级的**精确匹配**。                                                                                            |
| `http://example.com/static/style.css` | **Location 2** | 匹配 `^~ /static/`。Nginx 选择它后，**不再检查**后面的正则 Location 3 和 4。                                                  |
| `http://example.com/test.php`         | **Location 3** | 匹配正则 `\.php$`。虽然也匹配 Location 6 (`/`)，但**正则的优先级高于普通前缀**。                                                    |
| `http://example.com/INDEX.HTML`       | **Location 4** | 匹配不区分大小写的正则 `\.html$`。                                                                                     |
| `http://example.com/images/cat.jpg`   | **Location 5** | **普通前缀匹配**。虽然也匹配 Location 6 (`/`)，但 `/images/` 比 `/` **更长**。                                               |
| `http://example.com/some/path/`       | **Location 6** | 只匹配最通用的 `/`。                                                                                               |
| `http://example.com/static/app.php`   | **Location 2** | **关键例子**：首先它匹配 `^~ /static/`，因此 Nginx **立即选择 Location 2 并停止正则搜索**，即使后面有一个能匹配 `.php` 的正则 Location 3 也不会被检查。 |

### 最佳实践与建议

1.  **精确匹配 (`=`)**：用于非常具体、高频的端点（如 `/`, `/favicon.ico`），可以快速响应并减少匹配开销。
2.  **优先前缀 (`^~`)**：用于服务静态资源（如 `/static/`, `/assets/`）。因为它能避免不必要的正则表达式检查，提升性能，同时优先级又足够高。
3.  **正则表达式 (`~`, `~*`)**：用于基于文件扩展名（如 `\.php$`）或其他复杂模式的动态请求处理。注意它们的顺序很重要。
4.  **通用匹配 (`/`)**：总是作为兜底方案放在最后。
5.  **调试技巧**：如果不确定请求匹配了哪个 location，可以在 location 块中使用 `add_header X-Matched-Location "location-name";` 来帮助调试。
