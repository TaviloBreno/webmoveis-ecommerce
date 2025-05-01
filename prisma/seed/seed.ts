import { seedCategories } from "./data/categories";

async function main(){
  await seedCategories();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
  })