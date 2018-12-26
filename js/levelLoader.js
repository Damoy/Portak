var jsons = [];
var loadingID = 0;

var LevelLoadingContext = {
    getNewLoadingId : function(){
        return ++loadingID;
    },

    resetLevelLoadingId : function(){
        loadingID = 0;
    },

    getMenuFilePath : function(){
        return "res/levels/menu.lvl";
    },

    loadLevel : function(ctx, canvas, levelFilePath, width, height){
        println("Loading level...");
        let levelTexture = new Texture(ctx, canvas, levelFilePath, width, height);
        levelTexture.loadDataPixels();
        let levelTexturePixels = levelTexture.getDataPixels();
        println(levelTexturePixels);
        println("Level loaded.");
    },

    getLevelDataAccordingToId : function(id){
        switch(id){
            case 0: return level_zero;
            case 1: return level_one;
            case 2: return level_two;
            case 3: return level_three;
            case 4: return level_four;
            case 5: return level_five;
            case 6: return level_six;
            case 7: return level_seven;
            case 8: return level_eight;
            case 9: return level_nine;
            case 10: return level_ten;
            case 11: return level_eleven;
            case 12: return level_twelve;
            default: throw "Unknown level identifier.";
        }
    },

    loadJsonLevelGivenId : function(jsonData, ctx, canvas, world){
        let levelJson = jsonData[0];
        let levelId = parseInt(levelJson.id);
        let levelName = levelJson.name;
        let rows = parseInt(levelJson.rows);
        let cols = parseInt(levelJson.cols);
        let pAmount = parseInt(levelJson.playerBasePowerAmount);

        let playerX;
        let playerY;

        if(levelJson.player != null){
            playerX = MapContext.getNormX(levelJson.player.col);
            playerY = MapContext.getNormY(levelJson.player.row);
        }
        
        let tileId = 0;
        var map = new Map(ctx, canvas, world);
        var tiles = [];
        var walls = [];
        var enemies = [];
        var powers = [];
        var doors = [];
        var keys = [];
        var destructiblesWalls = [];
        let basePowerValue = 10;
        var texture = TextureContext.getGrayTileTexture();
        
        let portalId;
        let portalX;
        let portalY;

        if(levelJson.portal != null){
            portalId = levelJson.portal.id;
            portalX = MapContext.getNormX(levelJson.portal.col);
            portalY = MapContext.getNormY(levelJson.portal.row);
        }

        let arr_energies = levelJson.energies;

        if(arr_energies != null){
            arr_energies.forEach((energy) => {
                powers.push(new Power(ctx, canvas, world, MapContext.getNormX(energy.col),
                    MapContext.getNormY(energy.row), energy.value));
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, energy.row, energy.col, texture);
            });
        }

        let arr_doors = levelJson.doors;

        if(arr_doors != null){
            arr_doors.forEach((door) => {
                doors.push(new Door(ctx, canvas, world, MapContext.getNormX(door.col),
                    MapContext.getNormY(door.row), door.id));
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, door.row, door.col, texture);
            });
        }
        
        let arr_keys = levelJson.keys;
        if(arr_keys != null){
            arr_keys.forEach((key) => {
                keys.push(new Key(ctx, canvas, world, MapContext.getNormX(key.col),
                    MapContext.getNormY(key.row), key.id));
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, key.row, key.col, texture);
            });
        }

        let arr_walls = levelJson.walls;
        if(arr_walls != null){
            arr_walls.forEach((wall) => {
                walls.push(new Wall(ctx, canvas, world, MapContext.getNormX(wall.col),
                    MapContext.getNormY(wall.row)));
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, wall.row, wall.col, texture);
            });
        }

        let arr_destructibleWalls = levelJson.destructibleWalls;
        if(arr_destructibleWalls != null){
            arr_destructibleWalls.forEach((dwall) => {
                destructiblesWalls.push(new DestructibleWall(ctx, canvas, world, MapContext.getNormX(dwall.col),
                    MapContext.getNormY(dwall.row)));
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, dwall.row, dwall.col, texture);
            });
        }

        let arr_zombies = levelJson.zombies;
        if(arr_zombies != null){
            arr_zombies.forEach((zombie) => {
                let direction;

                if(zombie.direction == "LEFT"){
                    direction = AnimationContext.getLeftDirValue();
                } else if(zombie.direction == "RIGHT"){
                    direction = AnimationContext.getRightDirValue();
                } else if(zombie.direction == "DOWN"){
                    direction = AnimationContext.getDownDirValue();
                } else if(zombie.direction == "UP"){
                    direction = AnimationContext.getUpDirValue();
                } else {
                    console.log("Zombie direction is wrong. Level loading failed.");
                    return;
                }

                enemies.push(new Zombie(ctx, canvas, world, MapContext.getNormX(zombie.col),
                    MapContext.getNormY(zombie.row), direction));
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, zombie.row, zombie.col, texture);
            });
        }

        let arr_emptyTiles = levelJson.emptyTiles;
        if(arr_emptyTiles != null){
            arr_emptyTiles.forEach((tile) => {
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, tile.row, tile.col, texture);
            });
        }

        // remaining tiles
        LevelLoadingContext.loadTile(map, tiles, tileId++, cols,
            MapContext.getTileRow(playerY), MapContext.getTileCol(playerX), texture);
        LevelLoadingContext.loadTile(map, tiles, tileId++, cols,
            MapContext.getTileRow(portalY), MapContext.getTileCol(portalX), texture);

        map.rows = rows;
        map.cols = cols;
        map.tiles = tiles;

        var loadedLevel = new Level(levelId, levelName, null, ctx, canvas, world, map, walls, enemies, powers, basePowerValue, playerX, playerY, pAmount, doors, keys, destructiblesWalls);
        world.generatePortal(loadedLevel.getId(), portalX, portalY);
        console.log("Level \"" + levelName + "\" loaded.");

        let arr_fakePortals = levelJson.fakePortals;
        if(arr_fakePortals != null){
            console.log("Fake portals detected !");

            arr_fakePortals.forEach((fportal) => {
                world.generatePortalsFinalLevel(fportal.id, MapContext.getNormX(fportal.col), MapContext.getNormY(fportal.row));
                LevelLoadingContext.loadTile(map, tiles, tileId++, cols, fportal.row, fportal.col, texture);
            });
        }

        return loadedLevel;
    },

    loadTile : function(map, tiles, id, cols, row, col, texture){
        tiles[cols * row + col] = new Tile(id, map.getContext(), map.getCanvas(), map.getWorld(), map, row, col, texture);
    },

};
