
const crud = require('../crud');
async function generate() {
    try {
        await crud.reset_world();
        await crud.add_biome(-10,-10,10,10,'forest');
        await crud.add_biome(10,-10,10,10,'grassy field');
        console.log("done");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

generate()
