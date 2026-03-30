/*
------------------------------------------------------------
types.d.ts
Déclarations d’interfaces partagées côté client (props de boutons et tailles d’éléments).
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
export interface ButtonProps {
  text: string
  onPress?: () => void
}
export interface Size {
  width: number
  height: number
}

