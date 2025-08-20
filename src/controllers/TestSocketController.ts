import type { Request, Response } from "express";
import { Router } from "express";
import Controller from "./Controller";
import { SocketService } from "@services/Socket";
import { deleteCache, setCache } from "@helpers/Cache";
import { SOCKET_EMIT_TYPES } from "@utils/constant";
import { sleep } from "@utils/helper";

class TestSocketController extends Controller {
    private router: Router;
    constructor() {
        super();
        this.router = Router();
        // binding this
        this.index = this.index.bind(this);

        this.routes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private routes(): void {
        this.router.get("/:type/:status", this.index);
    }
    private async index(req: Request, res: Response) {
        const { type, status } = req.params
        if (!SOCKET_EMIT_TYPES.includes(type)) {
            return super.badRequest(res, 'Invalid socket type');
        }
        if (!['on', 'off'].includes(status)) {
            return super.badRequest(res, 'Invalid status type');
        }
        try {
            this.emitSocket(type, req.user.uuid)
            return super.success(res, 'success')

        } catch (error: any) {
            console.error(error);
            return super.error(res);
        }
    }

    private async emitSocket(type: string, userId: string) {
        const io = SocketService.getIO()
        const identifier = `${userId}:${type}`
        for (let current = 0; current <= 1000; current += 5) {
            // true means going
            const payload = { total: 1000, ongoing: current, status: true }
            io.emit(identifier, payload);
            console.log(identifier, payload)
            setCache(identifier, payload, 120)
            await sleep(1000);
        }
        // done
        io.emit(identifier, {
            total: 100, ongoing: 100, status: false
        })
        await deleteCache(identifier)
    }
}

export default new TestSocketController().getRouter();
