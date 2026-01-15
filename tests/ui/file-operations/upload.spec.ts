import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('File Upload Tests', () => {

    test('upload single file', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/upload');
            const filePath = path.join(__dirname, '../../../test-data/sample.txt');

        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles(filePath);

        await page.locator('#file-submit').click();

        await expect(page.locator('#uploaded-files')).toContainText('sample.txt');
    });

    /*
    test('upload multiple files', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/upload');
        const files = [
            path.join(__dirname, '../../../test-data/file1.txt'),
            path.join(__dirname, '../../../test-data/file2.txt'),
        ];
        const fileInput = page.locator('#file-upload');
        await fileInput.setInputFiles(files);

        await page.locator('#file-submit').click();

        const uploadedFiles = page.locator('#uploaded-files');
        await expect(uploadedFiles).toContainText('file1.txt');
        await expect(uploadedFiles).toContainText('file2.txt');
    });
    */

});