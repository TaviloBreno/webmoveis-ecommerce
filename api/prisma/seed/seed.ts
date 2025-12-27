import { seedCategories } from "./data/categories";
import { seedUsers } from "./data/users";
import { seedStores } from "./data/stores";
import { seedProducts } from "./data/products";

async function main(){
  console.log('🌱 Iniciando seed do banco de dados...');
  console.log('');
  
  await seedStores();
  console.log('');
  
  await seedCategories();
  console.log('');
  
  await seedUsers();
  console.log('');
  
  await seedProducts();
  console.log('');
  
  console.log('✅ Seed concluído com sucesso!');
}

main().catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })