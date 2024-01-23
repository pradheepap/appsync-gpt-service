import { util } from '@aws-appsync/utils'
export function request(ctx) {
    return {
        "version": "2023-09-30",
        "method": "POST",
        "resourcePath": `/model/anthropic.claude-instant-v1/invoke`,
        "params": {
            "headers": {
                "content-type": "application/json",
                "accept": "*/*"
            },
            "body": JSON.stringify({
                "prompt": "Human: " + getInstructions(ctx.args.role) + ctx.args.query + "\\n\\nAssistant:",
                "max_tokens_to_sample": 1000,
                "temperature": 1,
                "top_k": 250,
                "top_p": 0.999,
                "anthropic_version": "bedrock-2023-05-31"
            })
        }
    };
}
export function response(ctx) {
    if (ctx.error) util.error(ctx.error.message, ctx.error.type);
    if (ctx.result.statusCode === 200) {
        return { output: JSON.parse(ctx.result.body).completion }
    } else {
        util.appendError(ctx.result.body, ctx.result.statusCode);
    }
}

function getInstructions (role) {
    if (role === "philosopher") return "You play the role of a great philosopher, answer the following question as such: "
    if (role === "schoolteacher") return "You play the role of a school teacher speaking to a 5 years old child, answer the following question as such: "
    if (role === "politician") return "You play the role of a politician giving vague answers, answer the following question as such: "
    return "Please answer the following question: "
}