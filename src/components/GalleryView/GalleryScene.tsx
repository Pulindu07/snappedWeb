import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

// New component for first-person controls
const FirstPersonControls = () => {
  const { camera } = useThree();
  const moveState = useRef({
    forward: 0,
    backward: 0,
    left: 0,
    right: 0,
    up: 0,
    down: 0
  });
  const mouseState = useRef({
    isDown: false,
    x: 0,
    y: 0
  });
  const rotationY = useRef(0);
  const rotationX = useRef(0);  // For vertical tilt
  const MAX_TILT = Math.PI / 3; // Maximum vertical tilt angle (about 60 degrees)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': moveState.current.forward = 1; break;
        case 's': moveState.current.backward = 1; break;
        case 'a': moveState.current.left = 1; break;
        case 'd': moveState.current.right = 1; break;
        case 'q': moveState.current.up = 1; break;    // Move up
        case 'e': moveState.current.down = 1; break;  // Move down
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': moveState.current.forward = 0; break;
        case 's': moveState.current.backward = 0; break;
        case 'a': moveState.current.left = 0; break;
        case 'd': moveState.current.right = 0; break;
        case 'q': moveState.current.up = 0; break;
        case 'e': moveState.current.down = 0; break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseState.current.isDown = true;
      mouseState.current.x = e.clientX;
      mouseState.current.y = e.clientY;
    };

    const handleMouseUp = () => {
      mouseState.current.isDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseState.current.isDown) {
        const deltaX = e.clientX - mouseState.current.x;
        const deltaY = e.clientY - mouseState.current.y;
        
        // Horizontal rotation
        rotationY.current -= deltaX * 0.01;
        
        // Vertical rotation (tilt) with limits
        // rotationX.current -= deltaY * 0.01;
        // rotationX.current = Math.max(-MAX_TILT, Math.min(MAX_TILT, rotationX.current));
        
        mouseState.current.x = e.clientX;
        mouseState.current.y = e.clientY;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(() => {
    const speed = 0.15;
    const movement = new THREE.Vector3();
    
    // Calculate horizontal movement
    if (moveState.current.forward) movement.z -= speed;
    if (moveState.current.backward) movement.z += speed;
    if (moveState.current.left) movement.x -= speed;
    if (moveState.current.right) movement.x += speed;

    // Calculate vertical movement
    if (moveState.current.up) movement.y += speed;
    if (moveState.current.down) movement.y -= speed;

    // Apply rotation to horizontal movement only
    const horizontalMovement = new THREE.Vector3(movement.x, 0, movement.z)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY.current);

    // Combine with vertical movement
    const finalMovement = new THREE.Vector3(
      horizontalMovement.x,
      movement.y,
      horizontalMovement.z
    );

    // Get current room boundaries (adjust these values based on your room size)
    const roomLimits = {
      x: 24, // Half the room width
      y: 9,  // Room height
      z: 24  // Half the room depth
    };

    // Calculate new position with collision detection
    const newPosition = camera.position.clone().add(finalMovement);
    
    // Apply boundary limits with buffer
    const buffer = 1; // Buffer distance from walls
    newPosition.x = Math.max(-roomLimits.x + buffer, Math.min(roomLimits.x - buffer, newPosition.x));
    newPosition.y = Math.max(1, Math.min(roomLimits.y - buffer, newPosition.y)); // Minimum height of 1
    newPosition.z = Math.max(-roomLimits.z + buffer, Math.min(roomLimits.z - buffer, newPosition.z));

    // Update camera position and rotation
    camera.position.copy(newPosition);
    camera.rotation.set(rotationX.current, rotationY.current, 0, 'YXZ');
  });

  return null;
};

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

<group>
        <mesh position={[0, 0, -roomSize.depth/2]} visible={false}>
          <boxGeometry args={[roomSize.width, roomSize.height, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <mesh position={[0, 0, roomSize.depth/2]} visible={false}>
          <boxGeometry args={[roomSize.width, roomSize.height, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <mesh position={[-roomSize.width/2, 0, 0]} rotation={[0, Math.PI/2, 0]} visible={false}>
          <boxGeometry args={[roomSize.depth, roomSize.height, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <mesh position={[roomSize.width/2, 0, 0]} rotation={[0, -Math.PI/2, 0]} visible={false}>
          <boxGeometry args={[roomSize.depth, roomSize.height, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

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
            <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
            <FirstPersonControls />
            <Room photos={photos} />
            <ambientLight intensity={0.6} />
          </Canvas>
          <div className="absolute bottom-4 left-4 text-white/70 text-sm">
            <p>WASD keys to move • Q/E to move up/down • Click and drag to look around</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryScene;
