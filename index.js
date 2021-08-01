const path = require(`path`);
const app = require(`fastify`)({
    logger: true
});
const portfinder = require(`portfinder`);
const package = require(path.join(__dirname, `package.json`));

(() => new Promise(async (resolve, reject) => {
    try {
        await app.get(`/`, async (request, reply) => {
            Object.keys(await request.query).indexOf(`method`) > -1 && typeof await request.query.method == `string` && String(await request.query.method).length > 0 && Object.keys(await request.query).indexOf(`args`) > -1 && typeof await request.query.args == `string` && String(await request.query.args).length > 0 ? await reply.redirect(`${await request.query.method}://${await request.query.args}`) : await reply.type(`text/html`).send(`<!DOCTYPE html><form id=form><label for=method>Method: </label><input id=method name=method required><br><label for=args>Arguments: </label><input id=args name=args required><br><input type=submit value=Redirect></form><p>Query: <br>- Method = method<br>- Arguments = args</p><script>const onsubmit = event => {if (typeof document.getElementById(\`method\`).innerText == \`string\` && String(document.getElementById(\`method\`).innerText).length > 0 && typeof document.getElementById(\`args\`).innerText == \`string\` && String(document.getElementById(\`args\`).innerText).length > 0) {document.location.href = \`?method=\$\{document.getElementById(\`method\`).innerText\}&args=\$\{document.getElementById(\`args\`).innerText\}\`;event.preventDefault();};};document.getElementById(\`form\`).addEventListener(\`submit\`, onsubmit());</script>`);
        });
        return portfinder.getPort({
            port: typeof parseFloat(process.env.PORT) == `number` && !isNaN(parseFloat(process.env.PORT)) ? process.env.PORT : 3000
        }, async (error, port) => {
            if (error) return reject(error);
            else if (!error) return await app.listen(typeof process.env.HOST == `string` && String(process.env.HOST).length > 0 ? {
                port: port,
                host: process.env.HOST
            } : {
                port: port
            }, async (error, address) => {
                if (error) return reject(await error);
                else if (!error) return resolve(console.log(`${await package.display_name} is now listening on ${await address}`));
            });
        });
    } catch (error) {
        return reject(await error);
    };
}))();