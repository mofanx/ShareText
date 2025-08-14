module.exports = {
  apps: [{
    name: 'sharetext', // 应用名称
    script: 'server.js', // 入口文件
    instances: 'max', // 使用最大可用CPU核心数
    exec_mode: 'cluster', // 集群模式运行，提高性能
    env: {
      NODE_ENV: 'production', // 生产环境标识
    },
    port: 8322, // 端口号（与项目中配置一致）
    autorestart: true, // 自动重启
    watch: false, // 生产环境关闭文件监听
    max_memory_restart: '1G', // 内存超过1G时自动重启
    log_date_format: 'YYYY-MM-DD HH:mm:ss', // 日志时间格式
    merge_logs: true, // 合并日志
    output: './logs/out.log', // 标准输出日志
    error: './logs/error.log', // 错误日志
  }]
};