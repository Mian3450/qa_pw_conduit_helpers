import { test } from '@playwright/test';
import { EditArticlePage } from '../../src/ui/pages/article/EditArticlePage';
import { ViewArticlePage } from '../../src/ui/pages/article/ViewArticlePage';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { generateNewArticleData } from '../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { createNewArticle } from '../../src/ui/actions/article/createNewArticle';
import {
  TITLE_CANNOT_BE_EMPTY,
  DESCRIPTION_CANNOT_BE_EMPTY,
  TEXT_CANNOT_BE_EMPTY,
} from '../../src/ui/constants/articleErrorMessages';

test.describe('Edit article for an article with a tag', () => {
  let viewArticlePage;
  let editArticlePage;
  let article;
  let updatedArticle;

  test.beforeEach(async ({ page }) => {
    viewArticlePage = new ViewArticlePage(page);
    editArticlePage = new EditArticlePage(page);
    article = generateNewArticleData(1);
    updatedArticle = generateNewArticleData(1);

    const user = generateNewUserData();
    await signUpUser(page, user);
    await createNewArticle(page, article);
    await viewArticlePage.clickEditArticleButton();
  });

  test('Edit the article title for the existing article', async () => {
    await editArticlePage.fillTitleField(updatedArticle.title);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.assertArticleTitleIsVisible(updatedArticle.title);
  });

  test('Edit the article description for the existing article', async () => {
    await editArticlePage.fillDescriptionField(updatedArticle.description);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.clickEditArticleButton();
    await editArticlePage.assertDescriptionFieldValue(
      updatedArticle.description,
    );
  });

  test('Edit the article text for the existing article', async () => {
    await editArticlePage.fillTextField(updatedArticle.text);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.assertArticleTextIsVisible(updatedArticle.text);
  });

  test('Add the tag for the existing article with tags', async () => {
    const [newTag] = updatedArticle.tags;
    const [originalTag] = article.tags;

    await editArticlePage.addTag(newTag);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.assertTagIsVisible(newTag);
    await viewArticlePage.assertTagIsVisible(originalTag);
  });

  test('Remove an article tag for the existing article with tag', async () => {
    const [originalTag] = article.tags;

    await editArticlePage.removeTag(originalTag);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.assertTagIsNotVisible(originalTag);
  });

  test('Remove an article title for the existing article', async () => {
    await editArticlePage.clearTitleField();
    await editArticlePage.clickUpdateArticleButton();

    await editArticlePage.assertErrorMessageContainsText(
      TITLE_CANNOT_BE_EMPTY,
    );
  });

  test('Remove an article description for the existing article', async () => {
    await editArticlePage.clearDescriptionField();
    await editArticlePage.clickUpdateArticleButton();

    await editArticlePage.assertErrorMessageContainsText(
      DESCRIPTION_CANNOT_BE_EMPTY,
    );
  });

  test('Remove the article text for the existing article', async () => {
    await editArticlePage.clearTextField();
    await editArticlePage.clickUpdateArticleButton();

    await editArticlePage.assertErrorMessageContainsText(TEXT_CANNOT_BE_EMPTY);
  });

  test('Editing the title preserves the original tag', async () => {
    const [originalTag] = article.tags;

    await editArticlePage.fillTitleField(updatedArticle.title);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.assertArticleTitleIsVisible(updatedArticle.title);
    await viewArticlePage.assertTagIsVisible(originalTag);
  });

  test('Edit all article fields at once', async () => {
    await editArticlePage.fillTitleField(updatedArticle.title);
    await editArticlePage.fillDescriptionField(updatedArticle.description);
    await editArticlePage.fillTextField(updatedArticle.text);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.assertArticleTitleIsVisible(updatedArticle.title);
    await viewArticlePage.assertArticleTextIsVisible(updatedArticle.text);
  });
});

test.describe('Edit article for an article without tags', () => {
  let viewArticlePage;
  let editArticlePage;
  let article;
  let updatedArticle;

  test.beforeEach(async ({ page }) => {
    viewArticlePage = new ViewArticlePage(page);
    editArticlePage = new EditArticlePage(page);
    article = generateNewArticleData();
    updatedArticle = generateNewArticleData(1);

    const user = generateNewUserData();
    await signUpUser(page, user);
    await createNewArticle(page, article);
    await viewArticlePage.clickEditArticleButton();
  });

  test('Add the tag for the existing article without tags', async () => {
    const [newTag] = updatedArticle.tags;

    await editArticlePage.addTag(newTag);
    await editArticlePage.clickUpdateArticleButton();

    await viewArticlePage.waitForArticlePageLoaded();
    await viewArticlePage.assertTagIsVisible(newTag);
  });
});
