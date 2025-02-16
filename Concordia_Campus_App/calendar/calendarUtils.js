export function extractTokens(url){
    const params = new URLSearchParams(url.split('#')[1]);
    return {
        access_token: params.get('access_token'),
        refresh_token: params.get('refresh_token'),
        provider_token: params.get('provider_token')
    };
}


export function convertDateTime(input) {
    if (!input) return "N/A";
    const dateTime = new Date(input);
    return dateTime.toLocaleString();
  }