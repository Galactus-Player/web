/* tslint:disable */
/* eslint-disable */
/**
 * queueservice
 * Video queue service
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: sbirudavolu@umass.edu
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Video request
 * @export
 * @interface AddVideoRequest
 */
export interface AddVideoRequest {
    /**
     * 
     * @type {string}
     * @memberof AddVideoRequest
     */
    url?: string;
}

export function AddVideoRequestFromJSON(json: any): AddVideoRequest {
    return AddVideoRequestFromJSONTyped(json, false);
}

export function AddVideoRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AddVideoRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'url': !exists(json, 'url') ? undefined : json['url'],
    };
}

export function AddVideoRequestToJSON(value?: AddVideoRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'url': value.url,
    };
}

