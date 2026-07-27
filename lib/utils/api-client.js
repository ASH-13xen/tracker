async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

const jsonHeaders = { "Content-Type": "application/json" };

export const apiGet = (url) => fetch(url).then(handle);

export const apiPost = (url, body) =>
  fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify(body) }).then(handle);

export const apiPatch = (url, body) =>
  fetch(url, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify(body) }).then(handle);

export const apiDelete = (url) => fetch(url, { method: "DELETE" }).then(handle);

export const apiPostForm = (url, formData) =>
  fetch(url, { method: "POST", body: formData }).then(handle);

export const fetcher = (url) => apiGet(url);
