var LevelLoadingContext = {
    loadLevel : function(ctx, canvas, levelFilePath, width, height){
        println("Loading level...");
        let levelTexture = new Texture(ctx, canvas, levelFilePath, width, height);
        levelTexture.loadDataPixels();
        let levelTexturePixels = levelTexture.getDataPixels();
        println(levelTexturePixels);
        println("Level loaded.");
    },

    loadLevelFromFile(filePath){
        let fr = new FileReader();
        fr.readAsText(filePath);
        // fetch(filePath)
        // .then(text => console.log(text));
    },

};
