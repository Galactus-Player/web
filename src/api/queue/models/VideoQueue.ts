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
import {
    Video,
    VideoFromJSON,
    VideoFromJSONTyped,
    VideoToJSON,
} from './';

/**
 * Queue of videos
 * @export
 * @interface VideoQueue
 */
export interface VideoQueue {
    /**
     * 
     * @type {string}
     * @memberof VideoQueue
     */
    room?: string;
    /**
     * 
     * @type {Array<Video>}
     * @memberof VideoQueue
     */
    queue?: Array<Video>;
    /**
     * 
     * @type {Date}
     * @memberof VideoQueue
     */
    lastEdited?: Date;
    /**
     * 
     * @type {number}
     * @memberof VideoQueue
     */
    counter?: number;
}

export function VideoQueueFromJSON(json: any): VideoQueue {
    return VideoQueueFromJSONTyped(json, false);
}

export function VideoQueueFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoQueue {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'room': !exists(json, 'room') ? undefined : json['room'],
        'queue': !exists(json, 'queue') ? undefined : ((json['queue'] as Array<any>).map(VideoFromJSON)),
        'lastEdited': !exists(json, 'lastEdited') ? undefined : (new Date(json['lastEdited'])),
        'counter': !exists(json, 'counter') ? undefined : json['counter'],
    };
}

export function VideoQueueToJSON(value?: VideoQueue | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'room': value.room,
        'queue': value.queue === undefined ? undefined : ((value.queue as Array<any>).map(VideoToJSON)),
        'lastEdited': value.lastEdited === undefined ? undefined : (value.lastEdited.toISOString()),
        'counter': value.counter,
    };
}

