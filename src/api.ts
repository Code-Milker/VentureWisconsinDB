const baseUrl = "http://localhost:3001/trpc";
export const post = async (endpoint: string, payload: any = {}) => {
  const res = await postData(`${baseUrl}/${endpoint}`, payload);
  if (!res) throw Error("Data not found");
  return res;
};

async function postData(endpoint: string, data = {}) {
  // Default options are marked with *
  let response = await fetch(endpoint, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  response = await response.json();
  // @ts-ignore
  return response.result.data;
}

export async function getData(path: string, data?: any) {
  const params = data ? `?input=${encodeURI(JSON.stringify(data))}` : "";
  let response = await fetch(`${baseUrl}/${path}${params}`);
  response = await response.json();
  // @ts-ignore
  return response.result.data;
}
