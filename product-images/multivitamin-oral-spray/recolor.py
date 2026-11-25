import numpy as np, sys
from PIL import Image, ImageDraw, ImageFont
def hsv(rgb):
    mx=rgb.max(-1); mn=rgb.min(-1); d=mx-mn+1e-6; s=d/(mx+1e-6)
    r,g,b=rgb[...,0],rgb[...,1],rgb[...,2]
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
    return h,s,mx
def hsv2rgb(h,s,v):
    c=v*s; x=c*(1-abs((h/60)%2-1)); m=v-c; i=(h//60).astype(int)%6
    z=np.zeros_like(h); R=np.choose(i,[c,x,z,z,x,c]);G=np.choose(i,[x,c,c,x,z,z]);B=np.choose(i,[z,z,x,c,c,x])
    return np.stack([R+m,G+m,B+m],-1)
def recolor(img,target,smul,vmul):
    a=np.array(img).astype(float)/255; rgb=a[...,:3]; h,s,v=hsv(rgb)
    mask=(h>10)&(h<58)&(s>0.15)
    nh=(h-36+target)%360; ns=np.clip(s*smul,0,1)
    # darken strong colour more than soft tints so light tints stay light
    nv=v*(1-(1-vmul)*np.clip(s/0.8,0,1))
    out=a.copy(); out[...,:3]=np.where(mask[...,None],hsv2rgb(nh,ns,nv),rgb)
    return Image.fromarray((out*255).clip(0,255).astype('uint8'),'RGBA')
OPTS=[('original','Original Orange',None,1,1,'#ef9a1d'),
      ('purple','Berry Purple',282,0.85,0.72,'#8b4bb0'),
      ('green','Fresh Green',135,0.85,0.72,'#3d9e5a'),
      ('teal','Ocean Teal',182,0.95,0.70,'#1d9e9b'),
      ('blue','Royal Blue',222,0.90,0.78,'#3462c9'),
      ('coral','Coral Red',356,0.85,0.92,'#e5535e'),
      ('magenta','Raspberry Pink',330,0.80,0.80,'#c63d84')]
if __name__=='__main__':
    full=Image.open('cut/mv-full-2x.png')
    bb=full.getchannel('A').point(lambda v:255 if v>8 else 0).getbbox(); full=full.crop(bb)
    tiles=[]
    for key,name,t,sm,vm,sw in OPTS:
        im=full if t is None else recolor(full,t,sm,vm)
        im.save(f'colours/pack-{key}.png'); tiles.append((name,sw,im))
    f=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',40)
    W,H=700,860; cols=4; rows=2
    S=Image.new('RGB',(cols*W,rows*H),'white'); d=ImageDraw.Draw(S)
    for i,(name,sw,im) in enumerate(tiles):
        x,y=(i%cols)*W,(i//cols)*H
        t=im.copy(); t.thumbnail((600,720),Image.LANCZOS)
        S.paste(t,(x+(W-t.width)//2,y+30),t)
        d.ellipse((x+60,y+775,x+110,y+825),fill=sw)
        d.text((x+130,y+800),f'{i}. {name}' if i else 'Current: Orange',font=f,fill=(27,34,64),anchor='lm')
    S.save('colours/options.png')
