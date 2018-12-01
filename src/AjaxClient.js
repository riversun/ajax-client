/**
 * AjaxClient
 * Simple XMLHttpRequest client.
 * Now supported 'post' method,dataType 'json'
 */
export default class AjaxClient {

    constructor() {
    }

    postAsync(m) {

        //use XMLHttpRequest2 style
        const xhr = new XMLHttpRequest();

        if (!m.url) {
            console.error("Please specify url.");
            return;
        }

        //use async mode
        const ASYNC = true;

        //Supported only 'post' method by now.
        xhr.open('post', m.url, ASYNC);

        //Supported only 'json' method by now.
        if (m.dataType && m.dataType == 'json') {
            xhr.responseType = 'text';
        } else {
            console.error('Please specify dataType. Supported only "json" now.');
        }

        if (m.contentType) {
            xhr.setRequestHeader('Content-Type', m.contentType);
        } else {
            console.error('Please specify contentType.');
            return;
        }

        //Original headers
        if (m.headers) {
            for (let key in m.headers) {
                const value = m.headers[key];
                xhr.setRequestHeader(key, value);
            }
        }

        if (m.timeOutMillis) {
            xhr.timeout = m.timeOutMillis;
        }

        xhr.onload = evt => {

            if (xhr.status == 200) {

                if (m.dataType == 'json') {
                    const data = JSON.parse(xhr.response);
                    if (m.success) {
                        m.success(data);
                    }
                }
            } else {

                console.error("error:"+xhr.statusText);
                if (m.error) {
                    m.error(evt);
                }
            }

        };


        if (m.timeout) {
            xhr.ontimeout = m.timeout;
        }

        if (m.error) {
            xhr.onerror = m.error;
        }

        if (m.data) {
            xhr.send(m.data);
        }

    }
}
