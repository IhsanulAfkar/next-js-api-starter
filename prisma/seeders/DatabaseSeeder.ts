import { PrismaClient } from "../generated/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // get all users
  const users = await prisma.user.findMany();

  // get all categories
  const categories = await prisma.articleCategory.findMany();
  if (categories.length === 0) {
    console.log("No categories found. Please seed categories first.");
    return;
  }

  for (const user of users) {
    // generate between 2–5 dummy articles per user
    const articleCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < articleCount; i++) {
      const category =
        categories[faker.number.int({ min: 0, max: categories.length - 1 })];

      const title = faker.lorem.sentence(6);

      // create article
      const article = await prisma.article.create({
        data: {
          user_id: user.id,
          category_id: category.id,
          slug: faker.helpers.slugify(title.toLowerCase()),
          title,
          content: faker.lorem.paragraphs(3),
          active: faker.datatype.boolean()
        }
      });

      // create between 1–3 images per article
      const imageCount = faker.number.int({ min: 1, max: 3 });
      const images = Array.from({ length: imageCount }).map(() => ({
        articleId: article.id,
        path: faker.image.urlPicsumPhotos({ width: 800, height: 600 }) // random placeholder image
      }));

      await prisma.articleImage.createMany({ data: images });
    }
  }

  console.log("Dummy articles with images seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
