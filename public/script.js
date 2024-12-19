const editor = document.getElementById('editor');
const status = document.getElementById('status');
let ws;
let isConnecting = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

// 连接 WebSocket
function connectWebSocket() {
    if (isConnecting) return;
    isConnecting = true;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        isConnecting = false;
        reconnectAttempts = 0;
        status.textContent = '已连接';
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    };

    ws.onclose = () => {
        isConnecting = false;
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            status.textContent = `连接断开，正在重连(${reconnectAttempts}/${maxReconnectAttempts})...`;
            // 使用指数退避重连
            setTimeout(connectWebSocket, 1000 * Math.pow(2, reconnectAttempts - 1));
        } else {
            status.textContent = '连接失败，请刷新页面重试';
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        isConnecting = false;
        status.textContent = '连接错误';
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'content') {
                // 只有当编辑器不是焦点状态，或者内容与当前不同时才更新
                if (document.activeElement !== editor || editor.value !== data.content) {
                    editor.value = data.content;
                    // 触发自定义事件，通知内容已更新
                    editor.dispatchEvent(new Event('contentUpdated'));
                }
            }
        } catch (error) {
            console.error('处理消息错误:', error);
        }
    };
}

// 发送更新
function sendUpdate() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const content = editor.value;
        ws.send(JSON.stringify({
            type: 'update',
            content: content
        }));
        return true;
    }
    return false;
}

// 监听输入事件
let updateTimeout;
editor.addEventListener('input', () => {
    status.textContent = '正在同步...';
    
    // 清除之前的定时器
    clearTimeout(updateTimeout);
    
    // 设置新的定时器，100ms 后发送更新
    updateTimeout = setTimeout(() => {
        if (sendUpdate()) {
            status.textContent = '已同步';
            setTimeout(() => {
                status.textContent = '';
            }, 1000);
        } else {
            status.textContent = '同步失败，正在重试...';
            // 如果发送失败，尝试重新连接
            connectWebSocket();
        }
    }, 100);
});

// 页面加载完成后初始化连接
window.addEventListener('load', () => {
    connectWebSocket();
});

// 页面关闭前尝试保存
window.addEventListener('beforeunload', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        sendUpdate();
    }
});
