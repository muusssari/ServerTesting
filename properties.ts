declare module '@socket.io/lib/socket.js' {
  interface Socket {
    /** the ifc type associated with this mesh */
    modelHash: string;
    
  }
}