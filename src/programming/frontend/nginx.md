---
title: 如何配置Nginx
order: 1
category: 编程日记
tags:
  - 前端
  - Nginx
icon: n
date: 2025-04-28
---

Nginx的配置一般放在其安装目录下的`conf/nginx.conf`中，其大致结构如下：

<!-- more -->

```nginx :no-collapsed-lines :no-line-numbers {16-23,26-41} title="nginx.conf"
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
        }

        error_page   404              /404.html;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

接下来，我们将高亮部分的两段内容详细介绍一下。

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

注释非常清晰，就不进行赘述了。

这样一来，浏览器访问Nginx服务器时，就会自动使用gzip进行压缩和解压，从而大大减小传输内容的体积。

## server 配置

在`http`下方可以配置多个`server`，`server`下面支持非常多的配置，解释起来也很复杂，因此下文将以不同的常用场景为例分别进行说明。

### 用作普通的 http 服务器

最基础的配置如下：

```nginx :no-line-numbers
http {
    server {
        listen       80;
        server_name  localhost;
    
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }
    }
}
```

这样配置后，访问 http://localhost/ 就会返回指定目录下的静态页面。

### 用作文件服务器

如果你想将Nginx用作文件服务器，让某个目录下的所有文件都能被直接访问，可以这样配置：

```nginx :no-line-numbers
http {
    server {
        listen       8080;
        server_name  fileserver;
    
        location /files/ {
            alias /data/files/;
            autoindex on; # 开启目录浏览
        }
    }
}
```

### 域名映射到端口

```nginx :no-line-numbers
http {
    server {
        listen       80;
        server_name  www.example.com;
        # ...
    }
    server {
        listen       80;
        server_name  api.example.com;
        # ...
    }
}
```

顺带一提，如何禁止直接通过IP访问，必须通过域名访问？可以增加一个默认的 server，专门拦截通过 IP 的访问：

```nginx :no-line-numbers :no-collapsed-lines
http {
    server {# [!code ++]
        listen 80 default_server;# [!code ++]
        server_name _;# [!code ++]
        return 404; # 直接断开连接，不返回任何内容 [!code ++]
    }# [!code ++]
    server {
        listen       80;
        server_name  www.example.com;
        # ...
    }
    server {
        listen       80;
        server_name  api.example.com;
        # ...
    }
}
```

将这段配置加在最上面。按照Nginx的规范，如果匹配不到`server_name`则会取第一个，就会直接返回 404 。这样一来，只有通过配置的域名才能访问，直接用 IP 访问会被拒绝。

### https 服务器（SSL认证）

配置 HTTPS 需要 SSL 证书和私钥：

```nginx :no-line-numbers :no-collapsed-lines
http {
    server {
        listen       443 ssl;
        server_name  www.example.com;
    
        ssl_certificate      /etc/nginx/ssl/example.crt;
        ssl_certificate_key  /etc/nginx/ssl/example.key;
    
        ssl_protocols        TLSv1.2 TLSv1.3;
        ssl_ciphers          HIGH:!aNULL:!MD5;
    
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

---

以上就是 Nginx server 配置的常见用法，实际项目中可根据需求灵活调整。
