import {Response} from "../models/types";

class MapperUtil {
    mapResponseSuccessful(data: any): Response{
        return {
            status: 200,
            data
        }
    }
    mapResponseFailed(data: any){
        return {
            status: 500,
            data
        }
    }
}
const mapperUtil = new MapperUtil();
export default mapperUtil;
