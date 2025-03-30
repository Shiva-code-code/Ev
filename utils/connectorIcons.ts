// utils/connectorIcons.ts

export const getConnectorIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'lvl1dc':
        return '⚡';
      case 'lvl2dc':
        return '🔌';
      case 'normalac':
        return '🔋';
      default:
        return '❓';
    }
  };
  