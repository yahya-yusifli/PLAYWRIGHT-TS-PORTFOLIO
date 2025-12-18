import { test, expect } from '@playwright/test';

/**
 * JSONPlaceholder API Testing Suite
 *
 * JSONPlaceholder is a free fake REST API used for testing.
 * Base URL: https://jsonplaceholder.typicode.com
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com';


test.describe('JSONPlaceholder - Users Tests', () => {

    test('should get all users', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/users`);

        expect(response.status()).toBe(200);

        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);

        const first = users[0];
        expect(first).toHaveProperty('id');
        expect(first).toHaveProperty('name');
        expect(first).toHaveProperty('email');
        expect(first).toHaveProperty('address');
        expect(first.address).toHaveProperty('city');

        console.log(`✓ Retrieved ${users.length} users`);
        console.log('✓ First user:', first.name);
    });

    
    test('should get single user by ID', async ({ request }) => {
        const userId = 1;
        const response = await request.get(`${BASE_URL}/users/${userId}`);

        expect(response.status()).toBe(200);

        const user = await response.json();
        expect(user.id).toBe(userId);
        expect(user.name).toBeTruthy();
        expect(user.email).toBeTruthy();

        console.log('✓ User retrieved:', user.name);
    });
});


test.describe('JSONPlaceholder - Posts Tests', () => {

    test('should get all posts', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts`);

        expect(response.status()).toBe(200);

        const posts = await response.json();
        expect(Array.isArray(posts)).toBeTruthy();
        expect(posts.length).toBeGreaterThan(0);

        const first = posts[0];
        expect(first).toHaveProperty('id');
        expect(first).toHaveProperty('title');
        expect(first).toHaveProperty('body');

        console.log(`✓ Retrieved ${posts.length} posts`);
        console.log('✓ First post:', first.title);
    });


    test('should create a new post', async ({ request }) => {
        const newPost = {
            title: 'Playwright API Test',
            body: 'This is a test post created using Playwright.',
            userId: 1
        };

        const response = await request.post(`${BASE_URL}/posts`, {
            data: newPost
        });

        expect(response.status()).toBe(201);

        const createdPost = await response.json();
        expect(createdPost).toHaveProperty('id');
        expect(createdPost.title).toBe(newPost.title);

        console.log('✓ Post created successfully');
    });


    test('should update an existing post', async ({ request }) => {
        const postId = 1;

        const updated = {
            title: 'Updated Title',
            body: 'Updated Body',
            userId: 1
        };

        const response = await request.put(`${BASE_URL}/posts/${postId}`, {
            data: updated
        });

        expect(response.status()).toBe(200);

        const result = await response.json();
        expect(result.title).toBe(updated.title);

        console.log('✓ Post updated successfully');
    });


    test('should delete a post', async ({ request }) => {
        const postId = 1;

        const response = await request.delete(`${BASE_URL}/posts/${postId}`);

        expect(response.status()).toBe(200);

        console.log('✓ Post deleted (mocked by API)');
    });
});



test.describe('JSONPlaceholder - Comments Tests', () => {

    test('should get comments for a post', async ({ request }) => {
        const postId = 1;
        const response = await request.get(`${BASE_URL}/posts/${postId}/comments`);

        expect(response.status()).toBe(200);

        const comments = await response.json();
        expect(Array.isArray(comments)).toBeTruthy();
        expect(comments.length).toBeGreaterThan(0);

        comments.forEach((comment: { postId: any; }) => {
            expect(comment.postId).toBe(postId);
        });

        console.log(`✓ Retrieved ${comments.length} comments for post ${postId}`);
    });
});


/* ---------------------------------------------------------
   TODOS
--------------------------------------------------------- */

test.describe('JSONPlaceholder - Todos Tests', () => {

    test('should get all todos', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/todos`);

        expect(response.status()).toBe(200);

        const todos = await response.json();
        expect(Array.isArray(todos)).toBeTruthy();
        expect(todos.length).toBeGreaterThan(0);

        const first = todos[0];
        expect(first).toHaveProperty('completed');

        console.log(`✓ Retrieved ${todos.length} todos`);
    });


    test('should get completed todos', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/todos?completed=true`);

        expect(response.status()).toBe(200);

        const todos = await response.json();
        expect(Array.isArray(todos)).toBeTruthy();

        todos.forEach((todo: { completed: any; }) => {
            expect(todo.completed).toBe(true);
        });

        console.log(`✓ Retrieved ${todos.length} completed todos`);
    });
});


/* ---------------------------------------------------------
   ALBUMS + PHOTOS
--------------------------------------------------------- */

test.describe('JSONPlaceholder - Album & Photos Tests', () => {

    test('should get all albums', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/albums`);

        expect(response.status()).toBe(200);

        const albums = await response.json();
        expect(Array.isArray(albums)).toBeTruthy();

        console.log(`✓ Retrieved ${albums.length} albums`);
    });


    test('should get photos for album', async ({ request }) => {
        const albumId = 1;

        const response = await request.get(`${BASE_URL}/albums/${albumId}/photos`);

        expect(response.status()).toBe(200);

        const photos = await response.json();
        expect(Array.isArray(photos)).toBeTruthy();

        photos.forEach((photo: { albumId: any; }) => {
            expect(photo.albumId).toBe(albumId);
        });

        console.log(`✓ Retrieved ${photos.length} photos from album ${albumId}`);
    });
});