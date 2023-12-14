import {
    Middleware,
    ExpressErrorMiddlewareInterface
} from "routing-controllers";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    public error(
        error: any,
        request: any,
        response: any,
        next: (err: any) => any
    ) {
        if (response.headersSent) {
            return;
        }

        response.json(error);
    }
}