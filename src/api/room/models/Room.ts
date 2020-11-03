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

import { exists } from '../runtime';
/**
 * A room
 * @export
 * @interface Room
 */
export interface Room {
    /**
     *
     * @type {number}
     * @memberof Room
     */
    id?: number;
    /**
     *
     * @type {string}
     * @memberof Room
     */
    code?: string;
    /**
     *
     * @type {Date}
     * @memberof Room
     */
    createdAt?: Date;
}

export function RoomFromJSON(json: any): Room {
    return RoomFromJSONTyped(json);
}

export function RoomFromJSONTyped(json: any): Room {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'id': !exists(json, 'id') ? undefined : json['id'],
        'code': !exists(json, 'code') ? undefined : json['code'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
    };
}

export function RoomToJSON(value?: Room | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'id': value.id,
        'code': value.code,
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
    };
}


