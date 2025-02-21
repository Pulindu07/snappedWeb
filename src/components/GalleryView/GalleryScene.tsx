import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  Text,
} from "@react-three/drei";
import { VrButton } from "../Buttons";

interface PhotoData {
  id: string;
  url: string;
  fileName?: string;
}

interface FrameProps {
  position: [number, number, number];
  rotation: [number, number, number];
  photo: PhotoData;
  index: number;
}

const Frame: React.FC<FrameProps> = ({ position, rotation, photo, index }) => {
  const texture = useTexture(photo.url);
  const [dimensions, setDimensions] = useState<[number, number]>([3, 4.5]);
  const frameDepth = 0.1;

  useEffect(() => {
    if (texture) {
      const { image } = texture;
      const isLandscape = image.width > image.height;

      setDimensions(isLandscape ? [9, 6] : [6, 9]);

      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    }
  }, [texture]);

  const frameGeometry = useMemo(
    () => new THREE.BoxGeometry(dimensions[0], dimensions[1], frameDepth),
    [dimensions]
  );

  const displayName = useMemo(() => {
    const name = photo.fileName || `Photo ${index + 1}`;
    return name.length > 15 ? name.substring(0, 12) + "..." : name;
  }, [photo.fileName, index]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={frameGeometry}>
        <meshStandardMaterial color="#786449" />
      </mesh>

      <mesh position={[0, 0, frameDepth / 2 + 0.01]}>
        <planeGeometry args={[dimensions[0] - 0.2, dimensions[1] - 0.2]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      <Text
        position={[0, -dimensions[1] / 2 - 0.3, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {displayName}
      </Text>
    </group>
  );
};

const Room: React.FC<{ photos: PhotoData[] }> = ({ photos }) => {
  const FRAME_SPACING = 10;
  const WALL_OFFSET = 0.3;
  const ROW_HEIGHT = 2;
  const SECOND_ROW_HEIGHT = 12;

  const roomSize = useMemo(
    () => ({
      width: Math.max(50, Math.ceil(photos.length / 4) * FRAME_SPACING),
      height: 20,
      depth: Math.max(20, Math.ceil(photos.length / 4) * FRAME_SPACING),
    }),
    [photos.length]
  );

  const framePositions = useMemo(() => {
    const framesPerWall = Math.floor(roomSize.width / FRAME_SPACING);
    const positions: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    // Define wall configurations with proper typing
    const walls = [
      {
        // Front wall
        basePosition: [0, ROW_HEIGHT, -roomSize.depth / 2 + WALL_OFFSET] as [
          number,
          number,
          number,
        ],
        rotation: [0, 0, 0] as [number, number, number],
        axis: "x" as const,
      },
      {
        // Back wall
        basePosition: [0, ROW_HEIGHT, roomSize.depth / 2 - WALL_OFFSET] as [
          number,
          number,
          number,
        ],
        rotation: [0, Math.PI, 0] as [number, number, number],
        axis: "x" as const,
      },
      {
        // Left wall
        basePosition: [-roomSize.width / 2 + WALL_OFFSET, ROW_HEIGHT, 0] as [
          number,
          number,
          number,
        ],
        rotation: [0, Math.PI / 2, 0] as [number, number, number],
        axis: "z" as const,
      },
      {
        // Right wall
        basePosition: [roomSize.width / 2 - WALL_OFFSET, ROW_HEIGHT, 0] as [
          number,
          number,
          number,
        ],
        rotation: [0, -Math.PI / 2, 0] as [number, number, number],
        axis: "z" as const,
      },
    ];

    // Function to position frames along a wall
    const positionFramesOnWall = (
      wallConfig: (typeof walls)[0],
      height: number
    ) => {
      const frameCount = framesPerWall;
      const totalWidth = (frameCount - 1) * FRAME_SPACING;
      const startOffset = -totalWidth / 2;

      for (let i = 0; i < frameCount; i++) {
        const offset = startOffset + i * FRAME_SPACING;
        const position: [number, number, number] = [
          wallConfig.basePosition[0],
          height,
          wallConfig.basePosition[2],
        ];

        // Adjust position based on axis
        if (wallConfig.axis === "x") {
          position[0] = offset;
        } else {
          position[2] = offset;
        }

        positions.push({
          position,
          rotation: wallConfig.rotation,
        });
      }
    };

    // Position frames on first row
    walls.forEach((wall) => {
      positionFramesOnWall(wall, ROW_HEIGHT);
    });

    // Add second row if needed
    if (photos.length > positions.length) {
      walls.forEach((wall) => {
        positionFramesOnWall(wall, SECOND_ROW_HEIGHT);
      });
    }

    return positions;
  }, [roomSize.width, roomSize.depth]);

  return (
    <group>
      {/* Walls */}
      <mesh position={[0, 0, -roomSize.depth / 2]}>
        <boxGeometry args={[roomSize.width, roomSize.height, 0.2]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, roomSize.depth / 2]}>
        <boxGeometry args={[roomSize.width, roomSize.height, 0.2]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh
        position={[-roomSize.width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[roomSize.depth, roomSize.height, 0.2]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh
        position={[roomSize.width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry args={[roomSize.depth, roomSize.height, 0.2]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Floor */}
      <mesh
        position={[0, -roomSize.height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomSize.width, roomSize.depth]} />
        <meshStandardMaterial color="#a67c52" roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh
        position={[0, roomSize.height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[roomSize.width, roomSize.depth]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
      </mesh>

      {/* Frames */}
      {photos.map((photo, index) => {
        if (index >= framePositions.length) return null;
        const { position, rotation } = framePositions[index];
        return (
          <Frame
            key={photo.id}
            position={position}
            rotation={rotation}
            photo={photo}
            index={index}
          />
        );
      })}

      {/* Lighting setup remains the same */}
    </group>
  );
};
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

const GalleryScene: React.FC<{ photos: PhotoData[] }> = ({ photos }) => {
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
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 7, 10]} fov={60} />
            <OrbitControls
              enableZoom={true}
              maxDistance={20}
              minDistance={1}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              enablePan={true}
              enableRotate={true}
              target={[0, 5, 0]}
            />
            <ambientLight intensity={0.6} />
            <Room photos={photos} />
          </Canvas>
          <div className="absolute bottom-4 left-4 text-white/70 text-sm">
            <p>
              Drag to rotate • Scroll to zoom closer • Right-click + drag to pan
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryScene;
