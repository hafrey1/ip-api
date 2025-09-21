export default {
    async fetch(request) {
        const url = new URL(request.url);
        
        // 路由逻辑：API 请求返回JSON，其他请求返回HTML
        if (url.pathname === '/api') {
            // 返回JSON数据的原有逻辑
            const data = {
                Method: request.method,
                Url: request.url,
                IP: {
                    IP: request.headers.get('CF-Connecting-IP'),
                    Continent: request.cf.continent,
                    Country: request.cf.country,
                    IsEU: request.cf.isEUCountry,
                    Region: request.cf.region,
                    RegionCode: request.cf.regionCode,
                    City: request.cf.city,
                    Latitude: request.cf.latitude,
                    Longitude: request.cf.longitude,
                    PostalCode: request.cf.postalCode,
                    MetroCode: request.cf.metroCode,
                    Colo: request.cf.colo,
                    ASN: request.cf.asn,
                    ASOrganization: request.cf.asOrganization,
                    Timezone: request.cf.timezone
                },
                Headers: {},
                Security: {}
            };

            // 遍历并存储每个 HTTP 头，排除以 cf- 开头的 HTTP 头
            request.headers.forEach((value, name) => {
                if (!name.toLowerCase().startsWith('cf-')) {
                    data.Headers[name] = value;
                }
            });

            // 遍历 request.cf 并存储所需对象的属性到 Security 中
            for (const key in request.cf) {
                if (
                    key == 'clientTcpRtt'
                    || key == 'tlsCipher'
                    || key == 'tlsVersion'
                    || key == 'httpProtocol'
                    || key == 'clientHandshake'
                    || key == 'clientFinished'
                    || key == 'serverHandshake'
                    || key == 'serverFinished'
                    || key == 'corporateProxy'
                    || key == 'verifiedBot'
                    || key == 'score'
                ) {
                    if (typeof request.cf[key] === 'object') {
                        for (const innerKey in request.cf[key]) {
                            data.Security[innerKey] = request.cf[key][innerKey];
                        }
                    } else {
                        data.Security[key] = request.cf[key];
                    }
                }
            }

            var dataJson = JSON.stringify(data, null, 4);
            console.log(dataJson);

            // 设置 CORS 头部
            const corsHeaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400",
            };

            // 如果是 OPTIONS 请求，则直接返回204，这是预检请求的处理
            if (request.method === "OPTIONS") {
                return new Response(null, {
                    status: 204,
                    headers: corsHeaders,
                });
            }

            return new Response(dataJson, {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    ...corsHeaders,
                },
            });
        }
        
        // 默认返回HTML页面
        return new Response(HTML_CONTENT, {
            headers: {
                "Content-Type": "text/html;charset=UTF-8"
            }
        });
    }
};


const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="description" content="获取您的IP地址、浏览器信息、用户平台、传输协议和TLS版本。">
    <meta name="keywords" content="IP地址, 浏览器信息, 用户平台, 传输协议, TLS版本">
    <title>IP信息检测 | 获取您的网络标识</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #4361ee;
            --secondary-color: #3f37c9;
            --accent-color: #4cc9f0;
            --text-color: #333;
            --light-text: #777;
            --bg-color: #f8f9fa;
            --card-bg: #ffffff;
            --border-radius: 12px;
            --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            --transition: all 0.3s ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        /* 修复header文字层级问题 */
        .header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1rem 0;
            text-align: center;
            position: relative;
            overflow: hidden;
            /* 确保有足够的padding避免文字被遮挡 */
            padding-bottom: 1rem;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,224C672,235,768,213,864,181.3C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom center;
            background-size: cover;
            z-index: 0; /* 确保背景在最底层 */
            pointer-events: none; /* 不影响点击事件 */
        }
        
        .header-content {
            position: relative;
            z-index: 10; /* 提高文字内容的层级 */
            max-width: 600px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
            position: relative;
            z-index: 11; /* 确保标题在最前面 */
        }
        
        .header p {
            font-size: 1.2rem; /* 稍微增大字体 */
            max-width: 600px;
            margin: 0 auto;
            opacity: 0.95; /* 提高不透明度 */
            position: relative;
            z-index: 11; /* 确保副标题在最前面 */
            line-height: 1.6;
            padding: 0 1rem; /* 添加内边距防止在小屏幕上贴边 */
            text-shadow: 0 1px 3px rgba(0,0,0,0.2); /* 添加文字阴影增强可读性 */
        }
        
        /* 响应式优化 */
        @media (max-width: 768px) {
            .header {
                padding: 1.5rem 0 2.5rem 0; /* 移动端调整padding */
            }
            
            .header h1 {
                font-size: 2rem; /* 移动端字体稍小 */
            }
            
            .header p {
                font-size: 1.1rem;
                padding: 0 1.5rem;
            }
        }
        
        @media (max-width: 480px) {
            .header p {
                font-size: 1rem;
                padding: 0 2rem;
            }
        }
        .container {
            transform: translateY(50px); /* 下移 10px */
            width: 90%;
            max-width: 1000px;
            margin: -50px auto 2rem;
            position: relative;
            z-index: 2;
            flex: 1;
        }
        
        .ip-card {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            overflow: hidden;
            transition: var(--transition);
        }
        
        .ip-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
            transform: translateY(10px); /* 下移 10px */
            padding: 0.6rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .card-header h2 {
            color: var(--primary-color);
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }
        
        .refresh-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
        }
        
        .refresh-btn:hover {
            background-color: var(--secondary-color);
        }
        
        .refresh-btn i {
            transition: transform 0.3s ease;
        }
        
        .refresh-btn:hover i {
            transform: rotate(180deg);
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            padding: 1.5rem;
        }
        
        .info-item {
            background-color: rgba(67, 97, 238, 0.05);
            border-radius: var(--border-radius);
            padding: 1.2rem;
            transition: var(--transition);
        }
        
        .info-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .info-item .label {
            color: var(--light-text);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-item .label i {
            color: var(--primary-color);
        }
        
        .info-item .value {
            font-size: 1.1rem;
            font-weight: 600;
            word-break: break-word;
        }
        
        .info-item .loading {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--light-text);
        }
        
        .location-map {
            padding: 1.5rem;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .map-placeholder {
            background-color: rgba(67, 97, 238, 0.05);
            border-radius: var(--border-radius);
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--light-text);
            font-size: 1.1rem;
        }
        
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
        
        .pulse {
            animation: pulse 1.5s infinite;
        }
        
        .footer {
            text-align: center;
            padding: 2rem 1rem;
            background-color: white;
            margin-top: auto;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .footer a {
            color: var(--primary-color);
            text-decoration: none;
            transition: var(--transition);
        }
        
        .footer a:hover {
            color: var(--secondary-color);
            text-decoration: underline;
        }
        
        .divider {
            display: inline-block;
            margin: 0 10px;
            color: var(--light-text);
        }
        
        .copy-btn {
            background: none;
            border: none;
            color: var(--light-text);
            cursor: pointer;
            font-size: 0.9rem;
            padding: 2px 5px;
            border-radius: 3px;
            transition: var(--transition);
            margin-left: 5px;
        }
        
        .copy-btn:hover {
            background-color: rgba(67, 97, 238, 0.1);
            color: var(--primary-color);
        }
        
        .tooltip {
            position: relative;
        }
        
        .tooltip .tooltip-text {
            visibility: hidden;
            width: 80px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            transform: translateX(5px); /* 往右移动 20px */
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 0.8rem;
        }
        
        .tooltip:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        
        .dark-mode-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            transition: var(--transition);
            z-index: 100;
        }
        
        .dark-mode-toggle:hover {
            transform: scale(1.1);
        }
        
        body.dark-mode {
            --bg-color: #121212;
            --card-bg: #1e1e1e;
            --text-color: #e0e0e0;
            --light-text: #aaaaaa;
            --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        body.dark-mode .footer {
            background-color: #1e1e1e;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        body.dark-mode .info-item {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .container {
                width: 95%;
                margin-top: -30px;
            }
            
            .header h1 {
                font-size: 1.8rem;
            }
            
            .card-header {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .dark-mode-toggle {
                bottom: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
            }
        }
        
        /* 加载动画 */
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(67, 97, 238, 0.3);
            border-radius: 50%;
            border-top-color: var(--primary-color);
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>IP信息检测中心</h1>
            <p>获取您的网络标识、位置和浏览器信息</p>
        </div>
    </div>
    
    <div class="container">
        <div class="ip-card">
            <div class="card-header">
                <h2>您的网络信息</h2>
                <button id="refreshBtn" class="refresh-btn">
                    <i class="fas fa-sync-alt"></i> 刷新数据
                </button>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="label"><i class="fas fa-network-wired"></i> IP地址</div>
                    <div id="ipAddress" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-globe-asia"></i> 国家</div>
                    <div id="country" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-map-marker-alt"></i> 省份</div>
                    <div id="province" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-city"></i> 城市</div>
                    <div id="city" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-broadcast-tower"></i> 运营商</div>
                    <div id="isp" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-clock"></i> 时区</div>
                    <div id="timezone" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-building"></i> 组织</div>
                    <div id="organization" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-laptop"></i> 用户平台</div>
                    <div id="userPlatform" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-exchange-alt"></i> 传输协议</div>
                    <div id="httpProtocol" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-shield-alt"></i> TLS版本</div>
                    <div id="tlsVersion" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="label"><i class="fas fa-user-agent"></i> 用户代理</div>
                    <div id="userAgent" class="value">
                        <div class="loading">
                            <div class="loading-spinner"></div> 加载中...
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="location-map">
                <div class="map-placeholder" id="mapPlaceholder">
                    <i class="fas fa-map-marked-alt fa-3x pulse"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>
            <a href="https://github.com/hafrey1/ip-api" target="_blank">
                <i class="fab fa-github"></i> Github开源地址
            </a>
            <span class="divider">|</span>
            <a href="https://ip.527188.xyz/api" target="_blank">
                <i class="fas fa-link"></i> 本站接口地址
            </a>
            <span class="divider">|</span>
            <span>
                <i class="far fa-copyright"></i> 2024 IP info
            </span>
        </p>
    </div>
    
    <div class="dark-mode-toggle" id="darkModeToggle">
        <i class="fas fa-moon"></i>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            fetchIPInfo();
            
            // 刷新按钮事件
            document.getElementById('refreshBtn').addEventListener('click', function() {
                const button = this;
                const icon = button.querySelector('i');
                
                // 添加加载状态
                icon.classList.add('fa-spin');
                button.disabled = true;
                
                // 重置所有数据为加载状态
                const valueElements = document.querySelectorAll('.info-item .value');
                valueElements.forEach(el => {
                    el.innerHTML = '<div class="loading"><div class="loading-spinner"></div> 加载中...</div>';
                });
                
                // 获取数据
                fetchIPInfo().finally(() => {
                    // 恢复按钮状态
                    setTimeout(() => {
                        icon.classList.remove('fa-spin');
                        button.disabled = false;
                    }, 500);
                });
            });

            const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');

// 获取系统暗色模式偏好
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 检查用户本地存储设置
const userPref = localStorage.getItem('darkMode');

// 页面加载时设置初始模式
if (userPref === 'enabled') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
} else if (userPref === 'disabled') {
    body.classList.remove('dark-mode');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
} else if (systemPrefersDark) {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// 切换按钮事件
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        localStorage.setItem('darkMode', 'disabled');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// 可选：监听系统模式变化（仅在用户未手动选择时）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('darkMode')) { // 用户未手动设置时才跟随
        if (e.matches) {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});

            
            // 添加复制功能
            setupCopyFunctionality();
        });
        
		// 完全重写的安全版本 - 避免模板字符串问题
		async function fetchIPInfo() {
			try {
				const response = await fetch('/api');
				if (!response.ok) {
					throw new Error('网络请求失败');
				}
				
				const data = await response.json();
				
				// 更新数据显示
				updateElement('ipAddress', getValue(data, 'IP.IP'));
				updateElement('country', getValue(data, 'IP.Country'));
				updateElement('province', getValue(data, 'IP.Region'));
				updateElement('city', getValue(data, 'IP.City'));
				updateElement('isp', getValue(data, 'IP.ASOrganization'));
				updateElement('timezone', getValue(data, 'IP.Timezone'));
				updateElement('organization', getValue(data, 'IP.ASOrganization'));
				updateElement('userPlatform', getValue(data, 'Headers.sec-ch-ua-platform'));
				updateElement('httpProtocol', getValue(data, 'Security.httpProtocol'));
				updateElement('tlsVersion', getValue(data, 'Security.tlsVersion'));
				updateElement('userAgent', getValue(data, 'Headers.user-agent'));
				
				// 安全更新地图 - 使用DOM操作而不是innerHTML
				updateMapPlaceholder(
					getValue(data, 'IP.Country'),
					getValue(data, 'IP.Region'),
					getValue(data, 'IP.City')
				);
				
				return data;
			} catch (error) {
				console.error('获取IP信息失败:', error);
				showErrorState();
				throw error;
			}
		}
		
		// 安全获取嵌套对象值的辅助函数
		function getValue(obj, path, defaultValue = '未知') {
			try {
				const keys = path.split('.');
				let result = obj;
				for (const key of keys) {
					if (result && typeof result === 'object' && key in result) {
						result = result[key];
					} else {
						return defaultValue;
					}
				}
				return result != null ? String(result) : defaultValue;
			} catch {
				return defaultValue;
			}
		}
		
		// 使用DOM操作更新地图占位符
		function updateMapPlaceholder(country, region, city) {
			const mapPlaceholder = document.getElementById('mapPlaceholder');
			if (!mapPlaceholder) return;
			
			// 清空内容
			mapPlaceholder.innerHTML = '';
			
			// 创建容器
			const container = document.createElement('div');
			container.style.textAlign = 'center';
			
			// 创建图标
			const icon = document.createElement('i');
			icon.className = 'fas fa-map-marked-alt fa-3x';
			icon.style.color = 'var(--primary-color)';
			
			// 创建文本
			const text = document.createElement('p');
			text.style.marginTop = '10px';
			text.textContent = 'IP位置: ' + country + ' ' + region + ' ' + city;
			
			// 组装
			container.appendChild(icon);
			container.appendChild(text);
			mapPlaceholder.appendChild(container);
		}
		
		// 显示错误状态
		function showErrorState() {
			// 更新所有信息项
			const valueElements = document.querySelectorAll('.info-item .value');
			valueElements.forEach(el => {
				el.innerHTML = '';
				const errorDiv = document.createElement('div');
				errorDiv.style.color = '#ff4757';
				
				const errorIcon = document.createElement('i');
				errorIcon.className = 'fas fa-exclamation-circle';
				
				const errorText = document.createTextNode(' 加载失败');
				
				errorDiv.appendChild(errorIcon);
				errorDiv.appendChild(errorText);
				el.appendChild(errorDiv);
			});
			
			// 更新地图占位符
			const mapPlaceholder = document.getElementById('mapPlaceholder');
			if (mapPlaceholder) {
				mapPlaceholder.innerHTML = '';
				
				const container = document.createElement('div');
				container.style.textAlign = 'center';
				container.style.color = '#ff4757';
				
				const icon = document.createElement('i');
				icon.className = 'fas fa-exclamation-triangle fa-3x';
				
				const text = document.createElement('p');
				text.style.marginTop = '10px';
				text.textContent = '无法加载位置数据';
				
				container.appendChild(icon);
				container.appendChild(text);
				mapPlaceholder.appendChild(container);
			}
		}
		
		// 增强的 updateElement 函数 - 完全避免innerHTML拼接
		function updateElement(id, value) {
			const element = document.getElementById(id);
			if (!element) return;
			
			// 清空现有内容
			element.innerHTML = '';
			
			// 创建tooltip容器
			const tooltip = document.createElement('div');
			tooltip.className = 'tooltip';
			
			// 添加文本内容
			const textNode = document.createTextNode(value || '未知');
			tooltip.appendChild(textNode);
			
			// 创建复制按钮
			const copyBtn = document.createElement('button');
			copyBtn.className = 'copy-btn';
			copyBtn.setAttribute('data-value', value || '未知');
			
			const copyIcon = document.createElement('i');
			copyIcon.className = 'far fa-copy';
			copyBtn.appendChild(copyIcon);
			
			// 创建工具提示文本
			const tooltipText = document.createElement('span');
			tooltipText.className = 'tooltip-text';
			tooltipText.textContent = '复制';
			
			// 组装
			tooltip.appendChild(copyBtn);
			tooltip.appendChild(tooltipText);
			element.appendChild(tooltip);
		}
        
        function setupCopyFunctionality() {
            document.addEventListener('click', function(e) {
                if (e.target.closest('.copy-btn')) {
                    const button = e.target.closest('.copy-btn');
                    const value = button.getAttribute('data-value');
                    const tooltip = button.parentElement.querySelector('.tooltip-text');
                    
                    navigator.clipboard.writeText(value).then(() => {
                        // 更改图标和工具提示文本以指示复制成功
                        const icon = button.querySelector('i');
                        const originalClass = icon.className;
                        const originalTooltip = tooltip.textContent;
                        
                        icon.className = 'fas fa-check';
                        tooltip.textContent = '已复制!';
                        
                        // 2秒后恢复
                        setTimeout(() => {
                            icon.className = originalClass;
                            tooltip.textContent = originalTooltip;
                        }, 2000);
                    });
                }
            });
        }
    </script>
</body>
</html>

`;
