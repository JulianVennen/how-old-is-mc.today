import {PistonMetaVersionManifest} from "./pistonmeta";
import {formatTime, format} from "./util";

export interface Env {
    // Example Binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_R2_BUCKET: R2Bucket;
}

function html(body: string, manifest: PistonMetaVersionManifest, title_version: string|null = null): string {
    return format(`<!DOCTYPE html>
        <html lang="en">
            <head>
                <title>How old is Minecraft ${title_version ?? ""} today?</title>
                <link rel="icon" href="/public/favicon.svg">
                <link rel="stylesheet" href="/public/index.css">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="description" content="View the age of any Minecraft version">
            </head>
            <body>
                <div class = center>
                    <div class="center-text" id="age">
                        ${format(body, 24)}
                    </div>
                </div>
                <div id="footer">
                    <div class="center-text">
                        <p id="links">${manifest.getPromotedVersions().map(v => `<a href="/${v.id}">${v.id}</a>`).join(' ')}</p>
                        <p>Made by <a href="https://vennen.me">Julian Vennen</a></p>
                    </div>
                </div>
            </body>
        </html>`);
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        if (url.pathname === "/") {
            url.pathname = "/1.0";
        }
        if (url.pathname.startsWith("/public/")) {
            switch (url.pathname.slice("/public".length)) {
                case "/favicon.svg":
                    return new Response("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill='#FFFFFF' d=\"M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z\"/></svg>", {
                        status: 200,
                        headers: {
                            "content-type": "image/svg+xml"
                        }
                    });

                case "/index.css":
                    return new Response(format(`
                    body {
                        margin: 0;
                        padding: 0;
                    }
                                        
                    .center {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        width: 100%;
                    }
                    
                    .center-text {
                        display: block;
                        text-align: center;
                    }
                    
                    #footer {
                        position: absolute;
                        bottom: 5px;
                        width: 100vw;
                    }
                    
                    a {
                        color: black;
                    }
                    
                    @media only screen and (max-width: 600px) {
                        #links {
                            font-size: 1.2em;
                        }
                    }`), {
                        status: 200,
                        headers: {
                            "content-type": "text/css"
                        }
                    });

                default:
                    return new Response(null, {
                        status: 404
                    });
            }
        }

        const manifest = await PistonMetaVersionManifest.fetch();
        const versionName = url.pathname.match(/^\/([^/]+)\/?$/)?.at?.(1) ?? null;
        const version = versionName ? manifest.getVersion(versionName) : null;

        if (!version) {
            const body = `<h1> The Minecraft version ${versionName} does not exist. </h1>`;

            return new Response(html(body, manifest), {
                headers: {
                    'content-type': 'text/html;charset=UTF-8',
                    'cache-control': 'max-age=60',
                },
                status: 404,
            });
        }

        const dateFormatter = new Intl.DateTimeFormat(request.headers.get("locale") ?? undefined, {
            timeStyle: "short",
            dateStyle: "long",
        });

        const body = `<h1> Minecraft ${version.id} is ${formatTime(version.relativeReleaseTime)} old. </h1>
            <h2> It was released on ${dateFormatter.format(version.releaseTime)}. </h2>`

        return new Response(html(body, manifest, versionName), {
            headers: {
                'content-type': 'text/html;charset=UTF-8',
                'cache-control': 'max-age=60',
            },
        });
    },
};
