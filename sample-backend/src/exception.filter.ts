import { ArgumentsHost, Catch, HttpStatus, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError, timestamp } from "rxjs";

interface RpcError{
    status: HttpStatus;
    message: string;
    detail?: string
}


@Catch(RpcException)
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<RpcException>{
    catch(exception: any, host: ArgumentsHost): Observable<any> {
        const ctx = host.switchToRpc().getContext()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = 'Internal server error'
        let detail = ''

        if (exception instanceof RpcException){
            const errorResponse = exception.getError();
            if (typeof errorResponse === 'object' && errorResponse != null && 'status' in errorResponse){
                const rpcError = errorResponse as RpcError
                status = rpcError.status || HttpStatus.BAD_REQUEST;
                message = rpcError.message || 'RpcException occurred'
                detail = rpcError.detail || '';
            }
        }
        else {
            message = exception.message || message;
            detail = exception.detail || ''
        }

        const errorResponse = {
            status: status,
            message: message,
            detail: detail, 
            timestamp: new Date().toISOString(),
            path: ctx.url
        }

        console.log(errorResponse)

        return throwError(() => errorResponse)
    }
}