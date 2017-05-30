function AMImage() {
    AMObject.call(this)

    //set defaults
    this.type = 'AMImage'
    this.label = 'Image'
    this.values.isArtwork = false

    var props = {
        file_name: { label: 'file_name', type: 'file', default: 'missing.png', values: 'media' },
        red: { label: 'red', type: 'range', default: 255, min: 0, max: 255 },
        green: { label: 'green', type: 'range', default: 255, min: 0, max: 255 },
        blue: { label: 'blue', type: 'range', default: 255, min: 0, max: 255 },
        alpha: { label: 'alpha', type: 'range', default: 255, min: 0, max: 255 },
        index_offset: { label: 'index_offset', type: 'number', default: 0 },
        filter_offset: { label: 'filter_offset', type: 'number', default: 0 },
        skew_x: { label: 'skew_x', type: 'number', default: 0 },
        skew_y: { label: 'skew_y', type: 'number', default: 0 },
        pinch_x: { label: 'pinch_x', type: 'number', default: 0 },
        pinch_y: { label: 'pinch_y', type: 'number', default: 0 },
        subimg_x: { label: 'subimg_x', type: 'number', default: 0 },
        subimg_y: { label: 'subimg_y', type: 'number', default: 0 },
        subimg_width: { label: 'subimg_width', type: 'number', default: 0 },
        subimg_height: { label: 'subimg_height', type: 'number', default: 0 },
        origin_x: { label: 'origin_x', type: 'number', default: 0 },
        origin_y: { label: 'origin_y', type: 'number', default: 0 },
        video_flags: { label: 'video_flags', type: 'multiselect', default: 0, values: [ { label: 'ImagesOnly', value: 1, checked: [1,3,5,7,9,11,13,15] }, { label: 'NoLoop', value: 2, checked: [2,3,6,7,10,11,14,15] }, { label: 'NoAutoStart', value: 4, checked: [4,5,6,7,12,13,14,15] }, { label: 'NoAudio', value: 8, checked: [8,9,10,11,12,13,14,15] }] },
        video_playing: { label: 'video_playing', type: 'bool', default: false },
        preserve_aspect_ratio: { label: 'preserve_aspect_ratio', type: 'bool', default: false },
        smooth: { label: 'smooth', type: 'bool', default: false },
        trigger: { label: 'trigger', type: 'text', default: '' },
        shader: { label: 'shader', type: 'text', default: '' }
    }

    Object.keys(props).forEach(function(key) {
        this.props[key] = props[key]
        this.values[key] = props[key].default
    }.bind(this))

    this.createElement = function() {
        this.el = document.createElement('div')
        this.el.style.textAlign = 'center'
        this.el.classList.add('image')
    }

    this.updateElement = function() {
        this.el.style.left = this.values.x + 'px'
        this.el.style.top = this.values.y + 'px'
        this.el.style.width = ( this.values.width ) ? this.values.width + 'px' : 'auto'
        this.el.style.height = ( this.values.height  ) ? this.values.height + 'px' : 'auto'
        this.el.style.display = ( this.values.visible && !this.hidden ) ? 'block' : 'none'
        this.el.style.transform = ( this.values.rotation ) ? 'rotate(' + this.values.rotation + 'deg)' : ''
        if ( this.values.zorder >= 0 ) this.el.style.zIndex = this.values.zorder
        
        var file = layout.findFile(this.values.file_name, 'name')
        this.el.style.backgroundImage = ( file ) ? 'url(\'' + file.data + '\')' : ''
        this.el.style.backgroundRepeat = 'no-repeat'
        this.el.style.backgroundPosition = ( this.values.preserve_aspect_ratio ) ? 'center' : '0 0'
        this.el.style.backgroundSize = ( this.values.preserve_aspect_ratio ) ? 'contain' : '100% 100%'
        
        //colorize image with svg filter
        var red = (this.values.red / 255 ) || 0
        var green = ( this.values.green / 255 ) || 0
        var blue = ( this.values.blue / 255 ) || 0
        riot.mixin('utils').createFilterColor('object-filter-' + this.id, red, green, blue)
        this.el.style.filter = 'url(\'#object-filter-' + this.id + '\')'
        
        var alpha = ( this.values.alpha > 0 ) ? this.values.alpha / 255 : 0
        this.el.style.opacity = alpha
        this.el.draggable = false
    }

    this.toSquirrel = function() {
        var code = ''
            code += 'local [object] = fe.add_image( "resources/" + [props].file_name, -1, -1, 1, 1)' + '\n'
            Object.keys(this.props).forEach(function(key) {
                switch(key) {
                    case 'video_playing':
                    case 'video_flags':
                    case 'subimg_x':
                    case 'subimg_y':
                    case 'subimg_width':
                    case 'subimg_height':
                    case 'shader':
                    case 'trigger':
                        //don't use yet
                        break
                    case 'zorder':
                        if ( this.values.zorder >= 0 ) code += '   [object].' + key + ' = [props].' + key + '\n'
                        break
                    default:
                       code += '   [object].' + key + ' = [props].' + key + '\n'
                       break
                }
            }.bind(this))
        return code
    }
}

AMImage.prototype = Object.create(AMObject.prototype)
AMImage.prototype.constructor = AMImage