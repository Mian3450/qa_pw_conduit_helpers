import { test, expect } from '@playwright/test';

export class ViewArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitleHeader = page.getByRole('heading');
    this.editArticleLink = page.getByRole('link', { name: 'Edit Article' });
    this.tagList = page.locator('.tag-list');
  }

  async clickEditArticleButton() {
    await test.step(`Click the 'Edit Article' button`, async () => {
      await this.editArticleLink.first().click();
      await this.page.waitForURL(/\/editor\//);
    });
  }

  async waitForArticlePageLoaded() {
    await test.step(`Wait for the article page to load`, async () => {
      await this.page.waitForURL(/\/article\//);
      await this.page.reload();
      await this.editArticleLink.first().waitFor();
    });
  }

  async assertArticleTitleIsVisible(title) {
    await test.step(`Assert the article has the '${title}' title`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleTextIsVisible(text) {
    await test.step(`Assert the article has correct text`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async assertTagIsVisible(tag) {
    await test.step(`Assert the '${tag}' tag is visible`, async () => {
      await expect(this.tagList.getByText(tag, { exact: true })).toBeVisible();
    });
  }

  async assertTagIsNotVisible(tag) {
    await test.step(`Assert the '${tag}' tag is not visible`, async () => {
      await expect(this.tagList.getByText(tag, { exact: true })).toBeHidden();
    });
  }
}
