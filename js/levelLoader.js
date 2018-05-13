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

    loadLevelFromFile : function(ctx, canvas, world, filePath){
        return LevelLoadingContext.loadLevelFromFileGivenId(LevelLoadingContext.getNewLoadingId(), ctx, canvas, world, filePath);
    },

    loadLevelFromFileGivenId : function(lid, ctx, canvas, world, filePath){
        let xml = new XMLHttpRequest();
        xml.open("GET", filePath, false);
        xml.send();

        println("Loading level...");
        
        // retrieve the number of the player energies
        let pAmount = xml.responseText.split("##powerAmount")[1].split(/\n/)[1];

        // retrieve the level name
        let levelName = xml.responseText.split("##levelName")[1].split(/\n/)[1];

        // retrieve the map size
        let numTiles = xml.responseText.split("##numberOfTiles")[1].split(/\n/);
        let mapRows = numTiles[1];
        let mapCols = numTiles[2];

        // retrieve the map information
        let levelDataText = filterTextBy(xml.responseText.split("##levelData")[1], /#.*/g).replace(/\n/g, " ").trim();
        let levelData = levelDataText.split(" ");

        var map = new Map(ctx, canvas, world);
        var tiles = [];
        let id = 0;
        let row = 0;
        let col = 0;
        let px = 0;
        let py = 0;
        var walls = [];
        var enemies = [];
        var powers = [];
        var doors = [];
        var keys = [];
        var destructiblesWalls = [];
        let basePowerValue = 10;
        var texture = TextureContext.getGrayTileTexture();
        let portalX = 0;
        let portalY = 0;

        for(let i = 0; i < levelData.length; ++i){
            let fileValue = castToInt(levelData[i]);
            let x = MapContext.getNormX(col);
            let y = MapContext.getNormY(row);

            switch(fileValue){
                case 0:
                    // player position
                    py = y;
                    px = x;
                    // stil has to tile under player
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 1:
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 2:
                    var wall = new Wall(ctx, canvas, world, x, y);
                    walls.push(wall);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 3:
                    var enemy = new Zombie(ctx, canvas, world, x, y, AnimationContext.getRightDirValue());
                    enemies.push(enemy);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 4:
                    var enemy = new Zombie(ctx, canvas, world, x, y, AnimationContext.getLeftDirValue());
                    enemies.push(enemy);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 5:
                    var enemy = new Zombie(ctx, canvas, world, x, y, AnimationContext.getUpDirValue());
                    enemies.push(enemy);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 6:
                    var enemy = new Zombie(ctx, canvas, world, x, y, AnimationContext.getDownDirValue());
                    enemies.push(enemy);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break; 
                case 8: 		
                    portalX = x;
                    portalY = y;
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 9:
                    var destructibleWall = new DestructibleWall(ctx, canvas, world, x, y);
                    destructiblesWalls.push(destructibleWall);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 40:
                case 41:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                    var door = new Door(ctx, canvas, world, x, y, fileValue);
                    doors.push(door);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                case 58:
                case 59:
                    var key = new Key(ctx, canvas, world, x, y, fileValue);
                    keys.push(key);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 71:
                case 72:
                case 73:
                case 74:
                case 75:
                case 76:
                case 77:
                case 78:
                case 79:
                case 80:
                case 81:
                case 82:
                case 83:
                case 84:
                case 85:
                case 86:
                case 87:
                case 88:
                case 89:
                case 90:
                    var power = new Power(ctx, canvas, world, x, y, fileValue - 70);
                    powers.push(power);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;  
                case 95:
                case 96:
                case 97:
                case 98:
                case 99:
                    world.generatePortalsFinalLevel(-fileValue % 10, x, y);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                default:
                    throw "Unknown token found while loading level.\n";
            }
            
            ++col;
            if(col >= mapCols){
                col = 0;
                ++row;
            }
        }

        map.rows = mapRows;
        map.cols = mapCols;
        map.tiles = tiles;

        var loadedLevel = new Level(lid, levelName, filePath, ctx, canvas, world, map, walls, enemies, powers, 10, px, py, pAmount, doors, keys, destructiblesWalls);
        world.generatePortal(loadedLevel.getId(), portalX, portalY);

        println("Level \"" + levelName + "\" loaded.");
        
        return loadedLevel;
    },

    loadTile : function(map, tiles, id, cols, row, col, texture){
        tiles[cols * row + col] = new Tile(id, map.getContext(), map.getCanvas(), map.getWorld(), map, row, col, texture);
    },

};
