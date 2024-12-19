const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 设置中间件
app.use(express.static('public'));
app.use(bodyParser.json());

const dataFile = path.join(__dirname, 'data', 'content.txt');

// 确保data目录存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// 初始化文件内容（如果不存在）
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '', 'utf8');
}

let currentContent = fs.readFileSync(dataFile, 'utf8');

// 广播内容给所有客户端
function broadcastContent(ws, content) {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            try {
                client.send(JSON.stringify({ type: 'content', content: content }));
            } catch (error) {
                console.error('广播错误:', error);
            }
        }
    });
}

// 保存内容到文件
function saveContent(content) {
    try {
        fs.writeFileSync(dataFile, content, 'utf8');
        currentContent = content;
        return true;
    } catch (error) {
        console.error('保存文件错误:', error);
        return false;
    }
}

// WebSocket 连接处理
wss.on('connection', (ws) => {
    console.log('新的客户端连接');
    
    // 发送当前内容给新连接的客户端
    try {
        ws.send(JSON.stringify({ type: 'content', content: currentContent }));
    } catch (error) {
        console.error('发送初始内容错误:', error);
    }

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'update') {
                if (saveContent(data.content)) {
                    broadcastContent(ws, data.content);
                }
            }
        } catch (error) {
            console.error('处理消息错误:', error);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
    });

    ws.on('close', () => {
        console.log('客户端断开连接');
    });
});

// 获取文本内容（保留 REST API 作为备用）
app.get('/api/content', (req, res) => {
    res.json({ content: currentContent });
});

const port = 8322;
server.listen(port, '0.0.0.0', () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
