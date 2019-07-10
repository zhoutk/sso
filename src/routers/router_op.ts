import * as Router from 'koa-router'
import * as jwt from 'jsonwebtoken'
import BaseDao from '../db/baseDao'

let router = new Router()
const config = G.CONFIGS.jwt

export default (() => {
    let process = async (ctx, next) => {
        let { command } = ctx.params
        switch (command) {
            case 'login':
                let rs = await new BaseDao('users').retrieve({ username: ctx.request.body.username })
                if (rs.status === G.STCODES.SUCCESS) {
                    let user = rs.data[0]
                    let token = jwt.sign({
                        userid: user.id,
                        username: user.username,
                    }, config.secret, {
                            expiresIn: config.expires_max,
                        }
                    )
                    ctx.body = G.jsResponse(G.STCODES.SUCCESS, 'login success.', { token })
                } else {
                    ctx.body = G.jsResponse(G.STCODES.QUERYEMPTY, 'The user is missing.')
                }
                break
            default:
                ctx.body = G.jsResponse(G.STCODES.NOTFOUNDERR, 'command is not found.')
                break
        }
    }
    return router.post('/op/:command', process)
})() 
