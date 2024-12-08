import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { stat } from "fs";
import { timestamp } from "rxjs";

interface errorInterface {
    status: HttpStatus;
    message: string;
    detail: string
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let detail = ''

        console.log(exception)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseObj: any = exception.getResponse();
            if (typeof responseObj === 'object' && responseObj != null) {
                if ('detail' in responseObj) {
                    const res = responseObj as errorInterface
                    message = res.message || exception.message;
                    detail = res.detail || '';
                }
                else {
                    message = 'The server cannot process this request due to invalid input types'
                    detail = (typeof responseObj === 'object') ? responseObj.message[0] : exception.message
                }
            }
        }
        else {
            const errorResponse = exception as errorInterface;
            console.error(errorResponse)
            status = errorResponse.status !== undefined && errorResponse.status in HttpStatus ? errorResponse.status : HttpStatus.INTERNAL_SERVER_ERROR;
            message = errorResponse.message || 'RpcException occurred';
            detail = errorResponse.detail || ''
        }
        response.status(status).json({
            status: status,
            message: message,
            detail: detail,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method
        })
    }
}
