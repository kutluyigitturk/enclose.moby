// =============================================================================
// strings.js — Localization strings for TR / EN
// =============================================================================

const STRINGS = {
    en: {
        // Canvas UI
        buoy:            'Buoy',
        area:            'Area',
        areaEmpty:       'Area: -',
        seeOptimal:      'See Optimal',
        yourSolution:    'Your Solution',
        optimalFound:    'You found the optimal solution!',

        // Buttons & Modals
        reset:           'RESET',
        howToPlay:       'How to Play',
        thisLevel:       'This Level',
        pastPuzzles:     'Past Puzzles',
        settings:        'Settings',
        gridOpacity:     'Grid Opacity',

        // Level stats
        statName:        'Name',
        statMadeBy:      'Made by',
        statSize:        'Size',
        statBuoyBudget:  'Buoy Budget',
        statLevelID:     'Level ID',

        // How to Play content
        howToPlayDesc:   'Enclose Moby in the biggest possible pen!',
        theRules:        'THE RULES',
        rule1:           'Click water tiles to place <b>buoys</b>.',
        rule2:           'You have limited buoys.',
        rule3:           "Moby can't move over land or buoys.",
        rule4:           'Bigger enclosure = bigger score!',
        tip:             'Hover to see where Moby might escape!',

        mobyMessages: [
            "You can't catch me!",
            "I'm too fast for you!",
            "Try harder, sailor!",
            "The ocean is my home!",
            "Freedom awaits!",
            "Nice try, captain!",
            "I am the king of the seven seas\nand you shall never enclose me.",
            "Call me ismael...",
            "It high time to get to sea\nas soon as I can.",
            "In for a penny, in for a pound!",
            "To the last I grapple with thee!",
            "*blub*\nTHIS way looks good...",
            "*splash*\nI can escape THIS way.",
        ],
        mobyWinMessages: [
            "Get me outta here!",
            "I find myself in prison even though I committed no crime.",
            "By what right do you imprison me within these walls?",
            "I am capable of so much more than being an enclosed whale. There has to be more to this world.",
            "I don't like being enclosed.",
            "Do you think I might be living in a realm of eternal frost?",
        ],
    },

    tr: {
        // Canvas UI
        buoy:            'Şamandıra',
        area:            'Alan',
        areaEmpty:       'Alan: -',
        seeOptimal:      'Optimal Alan',
        yourSolution:    'Çözümün',
        optimalFound:    'En uygun çözümü zaten buldun!',

        // Buttons & Modals
        reset:           'Sıfırla',
        howToPlay:       'Nasıl Oynanır?',
        thisLevel:       'Bu Seviye',
        pastPuzzles:     'Önceki Bulmacalar',
        settings:        'Ayarlar',
        gridOpacity:     'Izgara Şeffaflığı:',

        // Level stats
        statName:        'İsim',
        statMadeBy:      'Yaratıcı',
        statSize:        'Boyut',
        statBuoyBudget:  'Şamandıra Bütçesi',
        statLevelID:     'Seviye Kimliği',

        // How to Play content
        howToPlayDesc:   "Moby'yi mümkün olan en büyük alana hapsedin!",
        theRules:        'KURALLAR',
        rule1:           'Su karolarına tıklayarak <b>şamandıralar</b> yerleştirin.',
        rule2:           'Sınırlı sayıda şamandıranız var.',
        rule3:           'Moby karadan veya şamandıraların üzerinde atlayamaz.',
        rule4:           'Daha büyük kapalı alan = daha yüksek puan!',
        tip:             "Moby'nin kaçabileceği yeri görmek için fareyi üzerine getirin!",

        mobyMessages: [
            "Beni yakalayamazsın!",
            "Senin için çok hızlıyım!",
            "Daha çok çabala, denizci!",
            "Okyanus benim evim!",
            "Özgürlük bekliyor!",
            "İyi deneme, kaptan!",
            "Ben yedi denizin kralıyım\nve sen beni asla hapsedemezsin.",
            "Bana İsmail de...",
            "En kısa sürede denize açılma vakti geldi.",
            "Başlayan bitirmeli!",
            "Sonuna kadar seninle boğuşacağım!",
            "*blub*\nBU yol iyi görünüyor...",
            "*splash*\nBU yönden kaçabilirim.",
        ],
        mobyWinMessages: [
            "Buradan çıkar beni!",
            "Hiçbir suç işlemediğim halde kendimi hapiste buluyorum.",
            "Beni bu duvarlar arasına hapsetme hakkın var mı?",
            "Kapalı bir balina olmaktan çok daha fazlasına sahibim. Bu dünyada daha fazlası olmalı.",
            "Kapalı olmaktan hoşlanmıyorum.",
            "Acaba sonsuz bir don aleminde mi yaşıyorum?",
        ],
    }
};

let currentLang = 'en';

function t(key) {
    return STRINGS[currentLang][key] || STRINGS['en'][key] || key;
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('enclose_lang', lang);
}