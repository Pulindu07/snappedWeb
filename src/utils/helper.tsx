    // Helper function to get the correct background color class for hear reaction
export const getBackgroundColorClass = (color: string) => {
    switch (color) {
        case 'red':
            return 'bg-red-500';
        case 'blue':
            return 'bg-blue-500';
        case 'yellow':
            return 'bg-yellow-500';
        default:
            return 'bg-gray-500';
    }
};