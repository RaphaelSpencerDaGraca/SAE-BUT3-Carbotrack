export interface UpdateEmissionsDto {
  emissionValue: number;
  emissionType: 'lifestyle' | 'transport'; // Pour distinguer le type d'émission
}
