var LevelLoadingContext = {
    loadLevel : function(ctx, canvas, levelFilePath, width, height){
        println("Loading level...");
        let levelTexture = new Texture(ctx, canvas, levelFilePath, width, height);
        levelTexture.loadDataPixels();
        let levelTexturePixels = levelTexture.getDataPixels();
        println(levelTexturePixels);
        println("Level loaded.");
    }
};
