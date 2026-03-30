/*
------------------------------------------------------------
DiceMenu.tsx
Menu d’action d’un dé (affichage effets ou choix d’enchantement) avec boutons de confirmation et sons/animations.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Sprite from "../Sprite";
import { SPRITESHEET } from "@/assets/images/imageData";
import { heightProportion, widthProportion } from "@/service/utils";
import { colors, fontSize, spriteData } from "@/theme/theme";
import commonStyles from "@/theme/styles";
import { useGameStore } from "@/service/gameStore";
import { COMMAND_NAME, SOCKET_EVENT, Animation, ANIM_NAME, Dice, DICE_FACE, DiceData, EffectSequence as EffectSequenceData, Player } from "@/common/types";
import StyledButton from "../StyledButton";
import { sendCommand } from "@/service/gameCommand";
import EffectSequence from "../EffectSequence";
import Pulse from "../animation/Pulse";
import { addCallback, removeCallback } from "@/service/gameCommand";

interface DiceMenuProps {
    id: number
    playerId: number
    setSelected: Dispatch<SetStateAction<number | null>>
    selectedId?: number
    style?: StyleProp<ViewStyle>
}

const GROW_SCALING: number = 1.3
const GROW_DURATION: number = 900

const DiceMenu: FC<DiceMenuProps> = ({ id, playerId, setSelected, selectedId, style }) => {
    const [enchanting, setEnchanting] = useState<boolean>(false)
    const player: Player = useGameStore((s) => s.gameState?.players?.[playerId])
    const dice: Dice = useGameStore((s) => s.gameState?.players?.[playerId]?.dice[id])
    const [active, setActive] = useState<boolean>(false)
    const diceFaces = Object.values(DICE_FACE).filter((v): v is number => typeof v === 'number')
    let effectSequence: EffectSequenceData
    
    if (dice?.face == DICE_FACE.STAR) {
        const religion: number = useGameStore.getState().gameState?.players?.[playerId]?.user?.religion
        effectSequence = useGameStore.getState().gameValues?.religions?.[religion-1]?.skill
    }
    else {
        const diceData: DiceData[] = useGameStore.getState().gameValues?.dice
        const die: DiceData = diceData.find((d) => d.face == dice.face)
        effectSequence = die?.effectSequence
    }
    const enchant = (face: DICE_FACE) => {
        setEnchanting(false)
        setSelected(null)
        sendCommand(COMMAND_NAME.ENCHANT, id, face)
    }
    const handleAnimation = (animation: Animation) => {
        if (animation.target == playerId && animation.name == ANIM_NAME.DICE) {
            setActive(true)
            setTimeout(() => {
                setActive(false)
                setSelected(null)
            }, GROW_DURATION)
        }
    }

    useEffect(() => {
        addCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
        return () => removeCallback(SOCKET_EVENT.ANIMATION, handleAnimation)
      })

    if (!effectSequence || !player || !dice) return null


    return (
        <View style={[
            styles.container, style
            ]}
        >
            {enchanting ? (
                <View style={styles.diceRow}>
                  {diceFaces.map((face) => (
                      <Pressable
                      key={face}
                      onPress={() => enchant(face)}
                      style={({ pressed }) => [pressed && commonStyles.pressed]}
                      >
                          <Sprite
                              source={SPRITESHEET['dice']}
                              totalFrames={spriteData.diceNumber}
                              frameIndex={spriteData.diceRollNumber + face}
                              size={{ width: widthProportion(22), height: widthProportion(22) }}
                          />
                      </Pressable>
                  ))}
              </View>
            ) : (
                <Pressable
                    style={({ pressed }) => [pressed && commonStyles.pressed]}
                    onPress={() => {sendCommand(COMMAND_NAME.DICE, selectedId)}}
                >
                    <Pulse
                        active={active}
                        scaling={GROW_SCALING}
                        duration={GROW_DURATION}
                        style={styles.sequenceStyle}
                    >
                        <EffectSequence
                        icons={effectSequence.iconSequence}
                        iconSize={widthProportion(15)}
                        />
                    </Pulse>

                </Pressable>
            )}
            <View style={styles.buttonsRow}>
                <StyledButton
                    text='Annuler'
                    onPress={() => setSelected(null)}
                    textStyle={styles.textStyle}
                    buttonStyle={styles.cancelBtn}
                />
                <Pulse active={player.enchantedDice != 0}>
                    <StyledButton
                        text='Enchanter'
                        onPress={() => setEnchanting((v) => !v)}
                        textStyle={styles.textStyle}
                        buttonStyle={[
                            styles.enchantBtn,
                            {backgroundColor: player.enchantedDice != 0 ? colors.activated : colors.dark}
                        ]}
                        disabled={player.enchantedDice == 0}
                    />
                </Pulse>
            </View>
        </View>
    );
};

export default DiceMenu;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: colors.transparentBlack,
    },

    container: {
        ...commonStyles.centeredContainer,
        gap: heightProportion(2),
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: heightProportion(2)
    },

    buttonsRow: {
        ...commonStyles.horizontalContainer,
        gap: widthProportion(5),
    },
    diceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: widthProportion(5),
    },
    
    sequenceStyle: {
        backgroundColor: colors.light,
        borderColor: 'black',
        borderWidth: 4,
        padding: '2%',
        borderRadius: 20
    },

    textStyle: {
        ...commonStyles.labelText,
        ...commonStyles.smallTextShadow,
        fontSize: fontSize.small,

    },
    cancelBtn: {
        backgroundColor: colors.lobbyRed,
        ...commonStyles.buttonStyle,
    },
    enchantBtn: {
        backgroundColor: colors.dark,
        ...commonStyles.buttonStyle,
    },
    label: {
        ...commonStyles.labelText,
        ...commonStyles.smallTextShadow,
        fontSize: fontSize.medium,
        textAlign: 'left',
        width: '70%',
    },

    icon: {
        width: '20%',
        aspectRatio: 1,
    },
});
