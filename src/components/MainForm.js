import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button
} from 'antd';
import ReactJson from 'react-json-view'

const MainForm = (props) => {
    const initialRequestJSON = {
        "type": "log",
        "level": "info",
        "origin": "my macbook pro",
        "title": "sample log today",
        "payload": "{\"a\":1,\"b\":\"a sample text\"}",
        "metadata": "{\"key\":100,\"key2\":\"bla bla bla\"}"
    }

    const [apiKey, setApiKey] = useState("")
    const [responseData, setResponseData] = useState()
    const [requestBody, setRequestBody] = useState(initialRequestJSON)

    useEffect(() => {
        const key = localStorage.getItem('apiKey') || '';
        setApiKey(key)
    }, []);

    const editJSONRequest = (edit) => {
        setRequestBody(edit.updated_src)
    }

    const send = async () => {
        localStorage.setItem('apiKey', apiKey);
        const formData = new FormData();
        formData.append('api_key', apiKey);
        formData.append('json_request', JSON.stringify(requestBody));

        fetch('/test_send', {
            method: 'POST',
            body: new URLSearchParams({
                'api_key': apiKey,
                'json_request': JSON.stringify(requestBody)
            })
        })
            .then(response => response.json())
            .then(data => setResponseData(data));

    }

    if (requestBody == {}) {
        requestBody = initialRequestJSON
    }
    return (
        <div style={{ margin: "0 auto", textAlign: "center", width: "800px" }}>
            <div >
                <img src="br_logo.png" ></img>
                <div style={{ margin: "0 auto", textAlign: "left", width: "800px" }}>
                    <Form
                        layout="vertical"
                    >
                        <Form.Item
                            label="API Key"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', width: 'calc(100% )', marginTop: '10px' }}
                        >
                            <Input onChange={(event) => setApiKey(event.target.value)} value={apiKey} placeholder="Paste your API Key in here" />

                        </Form.Item>
                        <Form.Item
                            label="Request body"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', width: 'calc(100% )' }}
                        >

                            <ReactJson src={requestBody}
                                onEdit={(edit) => editJSONRequest(edit)}
                                onAdd={(edit) => editJSONRequest(edit)}
                                onDelete={(edit) => editJSONRequest(edit)}
                                style={{ marginTop: "10px", display: 'inline-block', width: 'calc(100% )', border: "1px solid lightgray", padding: "10px" }}
                            />

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => send()}>Send</Button>
                        </Form.Item>
                        <Form.Item
                            label="Response body"
                            style={{ display: 'inline-block', width: 'calc(100% )' }}
                        >
                            <ReactJson src={responseData}
                                style={{ marginTop: "10px", display: 'inline-block', width: 'calc(100% )', border: "1px solid lightgray", padding: "10px" }}
                            />

                        </Form.Item>
                    </Form>
                </div>
            </div>

        </div >)
}

export default MainForm;