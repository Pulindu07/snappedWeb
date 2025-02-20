import React, { useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, Text } from '@react-three/drei';
import { GridPhoto } from '../../utils/types';
import * as THREE from 'three';
import { FrameProps, GalleryViewProps } from '../types/types';
import { VrButton } from '../Buttons';

// Frame component remains unchanged
const Frame: React.FC<FrameProps & { photo: GridPhoto }> = ({ position, rotation, imageUrl, photo }) => {
  const texture = useTexture(imageUrl || '/placeholder.jpg');
  const [dimensions, setDimensions] = useState<[number, number]>([3, 4.5]); // Larger default size (portrait)
  const frameDepth = 0.1;
  
  useEffect(() => {
    if (texture) {
      const { image } = texture;
      const isLandscape = image.width > image.height;
      
      if (isLandscape) {
        setDimensions([5.4, 3.6]); // Landscape orientation (larger)
      } else {
        setDimensions([3.6, 5.4]); // Portrait orientation (larger)
      }
      
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    }
  }, [texture]);
  
  const frameGeometry = useMemo(() => 
    new THREE.BoxGeometry(dimensions[0], dimensions[1], frameDepth),
    [dimensions]
  );
  
  const innerWidth = dimensions[0] - 0.2;
  const innerHeight = dimensions[1] - 0.2;
  
  const displayName = useMemo(() => {
    const name = photo.fileName || 'Untitled';
    return name.length > 15 ? name.substring(0, 12) + '...' : name;
  }, [photo.fileName]);
  
  return (
    <group 
      position={new THREE.Vector3(...position)}
      rotation={new THREE.Euler(...rotation)}
    >
      <mesh geometry={frameGeometry}>
        <meshStandardMaterial color="#786449" />
      </mesh>
      
      <mesh position={[0, 0, frameDepth / 2 + 0.01]}>
        <planeGeometry args={[innerWidth, innerHeight]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      
      <Text
        position={[0, -dimensions[1]/2 - 0.3, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={dimensions[0] * 1.2}
      >
        {displayName}
      </Text>
    </group>
  );
};

// Room component remains unchanged
const Room: React.FC<{ photos: GridPhoto[] }> = ({ photos }) => {
  const FRAME_SPACING = 6;
  const WALL_OFFSET = 0.3;
  const ROW_HEIGHT = 6;
  const SECOND_ROW_HEIGHT = 12;
  
  const roomSize = useMemo(() => {
    const baseSize = Math.max(20, Math.ceil(photos.length / 4) * FRAME_SPACING);
    return {
      width: baseSize,
      height: 18,
      depth: baseSize
    };
  }, [photos.length]);
  
  const frames = useMemo(() => {
    const framesPerWall = Math.floor(roomSize.width / FRAME_SPACING);
    const framePositions: Array<{
      position: [number, number, number],
      rotation: [number, number, number]
    }> = [];
    
    const calculateWallPositions = (
      count: number,
      wallLength: number,
      wallHeight: number,
      isVertical: boolean,
      isPositiveDirection: boolean
    ) => {
      const positions: Array<{
        position: [number, number, number],
        rotation: [number, number, number]
      }> = [];
      
      const totalSpace = (count - 1) * FRAME_SPACING;
      const startPos = -totalSpace / 2;
      
      for (let i = 0; i < count; i++) {
        const offset = startPos + (i * FRAME_SPACING);
        let position: [number, number, number];
        let rotation: [number, number, number];
        
        if (isVertical) {
          const wallPos = isPositiveDirection ? roomSize.width/2 - WALL_OFFSET : -roomSize.width/2 + WALL_OFFSET;
          position = [wallPos, wallHeight, offset];
          rotation = [0, isPositiveDirection ? -Math.PI / 2 : Math.PI / 2, 0];
        } else {
          const wallPos = isPositiveDirection ? roomSize.depth/2 - WALL_OFFSET : -roomSize.depth/2 + WALL_OFFSET;
          position = [offset, wallHeight, wallPos];
          rotation = [0, isPositiveDirection ? Math.PI : 0, 0];
        }
        
        positions.push({ position, rotation });
      }
      
      return positions;
    };
    
    framePositions.push(...calculateWallPositions(framesPerWall, roomSize.width, ROW_HEIGHT, false, false));
    framePositions.push(...calculateWallPositions(framesPerWall, roomSize.width, ROW_HEIGHT, false, true));
    framePositions.push(...calculateWallPositions(framesPerWall, roomSize.depth, ROW_HEIGHT, true, true));
    framePositions.push(...calculateWallPositions(framesPerWall, roomSize.depth, ROW_HEIGHT, true, false));
    
    if (photos.length > framePositions.length) {
      framePositions.push(...calculateWallPositions(framesPerWall, roomSize.width, SECOND_ROW_HEIGHT, false, false));
      framePositions.push(...calculateWallPositions(framesPerWall, roomSize.width, SECOND_ROW_HEIGHT, false, true));
      framePositions.push(...calculateWallPositions(framesPerWall, roomSize.depth, SECOND_ROW_HEIGHT, true, true));
      framePositions.push(...calculateWallPositions(framesPerWall, roomSize.depth, SECOND_ROW_HEIGHT, true, false));
    }
    
    return framePositions;
  }, [roomSize.width, roomSize.depth]);
  
  const wallMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: "#e8e8e8",
      roughness: 0.7,
      metalness: 0.1
    }), []
  );
  
  const floorMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      color: "#a67c52",
      roughness: 0.8
    }), []
  );
  
  const ceilingMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: "#f0f0f0",
      roughness: 0.6,
    }), []
  );
  
  return (
    <group>
      <mesh position={[0, 0, -roomSize.depth/2]} material={wallMaterial}>
        <boxGeometry args={[roomSize.width, roomSize.height, 0.2]} />
      </mesh>
      <mesh position={[0, 0, roomSize.depth/2]} material={wallMaterial}>
        <boxGeometry args={[roomSize.width, roomSize.height, 0.2]} />
      </mesh>
      <mesh position={[roomSize.width/2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMaterial}>
        <boxGeometry args={[roomSize.depth, roomSize.height, 0.2]} />
      </mesh>
      <mesh position={[-roomSize.width/2, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial}>
        <boxGeometry args={[roomSize.depth, roomSize.height, 0.2]} />
      </mesh>
      
      <mesh position={[0, -roomSize.height/2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial} receiveShadow>
        <planeGeometry args={[roomSize.width, roomSize.depth]} />
      </mesh>
      
      <mesh position={[0, roomSize.height/2, 0]} rotation={[Math.PI / 2, 0, 0]} material={ceilingMaterial}>
        <planeGeometry args={[roomSize.width, roomSize.depth]} />
      </mesh>
      
      {photos.map((photo, index) => {
        if (index >= frames.length) return null;
        const frameData = frames[index];
        
        return (
          <Frame 
            key={photo.id}
            position={frameData.position}
            rotation={frameData.rotation}
            imageUrl={photo.prevUrl}
            photo={photo}
            index={index}
          />
        );
      })}
      
      <pointLight position={[0, roomSize.height/2 - 1, 0]} intensity={0.7} color="#ffffff" />
      <pointLight position={[0, ROW_HEIGHT, 0]} intensity={0.5} color="#ffffff" distance={15} />
      
      <spotLight 
        position={[0, roomSize.height/2 - 1, 0]} 
        angle={Math.PI/3}
        penumbra={0.5}
        intensity={0.3}
        color="#fffaf0"
        castShadow
      />
    </group>
  );
};

// Updated Scene component with restricted camera movement
const Scene: React.FC<{ photos: GridPhoto[] }> = ({ photos }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 7, 10]} fov={60} />
      <OrbitControls 
        enableZoom={true}
        maxDistance={5} // Allow further zoom out
        minDistance={0.01} // Allow getting much closer to photos
        minPolarAngle={Math.PI / 2} // Lock vertical rotation
        maxPolarAngle={Math.PI / 2} // Lock vertical rotation
        enablePan={true} // Allow horizontal panning
        enableRotate={true} // Allow horizontal rotation
        target={[0, 5, 0]} // Focus center point higher up
      />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 15, 5]} intensity={0.6} castShadow />
      <Room photos={photos} />
      
      <hemisphereLight intensity={0.3} groundColor="#b77e56" />
    </>
  );
};

// LoadingScreen and GalleryView components remain unchanged
const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center text-white">
    <div className="text-center">
      <div className="mb-4 text-2xl">Loading Gallery</div>
      <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/80 w-1/3 animate-[gallery-loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  </div>
);

const GalleryView: React.FC<GalleryViewProps> = ({ photos }) => {
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const handleGalleryOpen = () => {
    setShowGallery(true);
    setIsLoading(true);
  };
  
  const handleSceneLoaded = () => {
    setTimeout(() => setIsLoading(false), 800);
  };
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 hover:bg-white text-white rounded-full shadow-lg transition-all hover:scale-105 backdrop-blur-sm">
        <VrButton handleButtonClick={handleGalleryOpen} />
      </div>
  
      {showGallery && (
        <div className="fixed inset-0 z-[60] bg-black">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
          >
            Exit Gallery
          </button>
          
          {isLoading && <LoadingScreen />}
          
          <Canvas onCreated={handleSceneLoaded} shadows>
            <Suspense fallback={null}>
              <Scene photos={photos} />
            </Suspense>
          </Canvas>
          
          <div className="absolute bottom-4 left-4 text-white/70 text-sm">
            <p>Drag to rotate • Scroll to zoom closer • Right-click + drag to pan</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryView;