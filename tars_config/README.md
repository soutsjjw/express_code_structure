# the tars_config directory - for nginx

Here, we can put some nginx location conf to replace the conf in the Production Server.

Like in the following conf:
```json
server { 
    listen 80; 
    server_name webapi.soa.fws.qa.nt.ctripcorp.com;
    location /api/13091/json/ { 
        proxy_set_header X-Real-IP $remote_addr; 
        proxy_set_header Host $http_host; 
    }
}
```
We can replace:
```json
proxy_set_header X-Real-IP $remote_addr; 
proxy_set_header Host $http_host;
```