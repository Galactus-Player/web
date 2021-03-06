/* tslint:disable */
/* eslint-disable */
/**
 * roomservice
 * An implementation of joinable rooms
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: decline@umass.edu
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    Room,
    RoomFromJSON,
    // RoomToJSON,
} from '../models';

/**
 * no description
 */
export class RoomApi extends runtime.BaseAPI {

    /**
     * Create a new room
     */
    async addRoomRaw(): Promise<runtime.ApiResponse<Room>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/room`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RoomFromJSON(jsonValue));
    }

    /**
     * Create a new room
     */
    async addRoom(): Promise<Room> {
        const response = await this.addRoomRaw();
        return await response.value();
    }

}
