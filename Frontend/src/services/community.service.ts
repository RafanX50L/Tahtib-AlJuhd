import api from "@/services/implementation/api";

// Base path is handled by axios instance (HOST/api); community routes live under /community

export async function fetchFeed(cursor?: string) {
  const res = await api.get(`/community/feed`, { params: { cursor } });
  return res.data;
}

export async function fetchUserPosts(userId: string, cursor?: string) {
  const res = await api.get(`/community/user/${userId}/posts`, { params: { cursor } });
  return res.data;
}

export async function fetchUserProfile(userId: string) {
  const res = await api.get(`/community/user/${userId}/profile`);
  return res.data;
}

export async function fetchPost(postId: string) {
  const res = await api.get(`/community/posts/${postId}`);
  return res.data;
}

export async function createPost(form: FormData) {
  const res = await api.post(`/community/posts`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function toggleLike(postId: string) {
  const res = await api.post(`/community/posts/${postId}/like`);
  return res.data;
}

export async function addComment(postId: string, content: string, parentCommentId?: string) {
  const res = await api.post(`/community/posts/${postId}/comments`, { content, parentCommentId });
  return res.data;
}

export async function follow(targetUserId: string) {
  const res = await api.post(`/community/follow/${targetUserId}`);
  return res.data;
}

export async function unfollow(targetUserId: string) {
  const res = await api.delete(`/community/follow/${targetUserId}`);
  return res.data;
}

export async function searchUsers(q: string) {
  const res = await api.get(`/community/search`, { params: { q } });
  return res.data;
}


