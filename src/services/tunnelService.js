const localtunnel = require('localtunnel');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class TunnelService {
    constructor() {
        this.tunnel = null;
        this.cloudflaredProcess = null;
    }

    async createTunnel(port, options = {}) {
        const {
            type = 'localtunnel',
            subdomain = null,
            cloudflareToken = process.env.CLOUDFLARE_TOKEN,
            cloudflareHostname = process.env.CLOUDFLARE_HOSTNAME
        } = options;

        if (type === 'cloudflare') {
            return this.createCloudflareTunnel(port, cloudflareToken, cloudflareHostname);
        }
        return this.createLocalTunnel(port, subdomain);
    }

    async createLocalTunnel(port, subdomain) {
        try {
            const options = {
                port,
                subdomain
            };

            this.tunnel = await localtunnel(options);

            console.log('\n🌍 LocalTunnel URL:', this.tunnel.url);
            console.log('📡 Local port:', port);
            console.log('✨ LocalTunnel is ready!\n');

            this.tunnel.on('error', err => {
                console.error('❌ LocalTunnel error:', err);
            });

            this.tunnel.on('close', () => {
                console.log('🔒 LocalTunnel closed');
            });

            return this.tunnel;
        } catch (error) {
            console.error('❌ Failed to create LocalTunnel:', error);
            throw error;
        }
    }

    async createCloudflareTunnel(port, token, hostname) {
        try {
            if (!token || !hostname) {
                throw new Error('Cloudflare token and hostname are required');
            }

            // Check if cloudflared is installed
            try {
                await execAsync('cloudflared --version');
            } catch (error) {
                console.log('⚙️ Installing cloudflared...');
                await execAsync('npm install -g cloudflared');
            }

            // Start Cloudflare tunnel
            const command = `cloudflared tunnel --url http://localhost:${port}`;
            this.cloudflaredProcess = exec(command);

            console.log('\n🌥️  Cloudflare Tunnel starting...');
            console.log(`🔗 Hostname: ${hostname}`);
            console.log('📡 Local port:', port);
            console.log('✨ Cloudflare Tunnel is ready!\n');

            // Handle process events
            this.cloudflaredProcess.stdout.on('data', (data) => {
                console.log('🌥️ ', data.toString().trim());
            });

            this.cloudflaredProcess.stderr.on('data', (data) => {
                console.error('❌ ', data.toString().trim());
            });

            return this.cloudflaredProcess;
        } catch (error) {
            console.error('❌ Failed to create Cloudflare tunnel:', error);
            throw error;
        }
    }

    async closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
            this.tunnel = null;
        }
        if (this.cloudflaredProcess) {
            this.cloudflaredProcess.kill();
            this.cloudflaredProcess = null;
        }
    }
}

module.exports = new TunnelService(); 