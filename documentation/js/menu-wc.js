'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">condo-nest documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' : 'data-bs-target="#xs-controllers-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' :
                                            'id="xs-controllers-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' : 'data-bs-target="#xs-injectables-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' :
                                        'id="xs-injectables-links-module-AppModule-698bd4893e8e436361a0149d672a2a886afca9b0548241dad4be31ea601626346164a9ed09c2afcde56527b01d91b97f800d36925a14cfd3c91529863c0b08f4"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' :
                                            'id="xs-controllers-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' :
                                        'id="xs-injectables-links-module-AuthModule-79020f4f9d0731e7db047977990883e560e51a8a92164e22cf5199faac503dfea548c8f99f5620e1e8e0612ea471a9849a6e995cadb9f97d97a0bbcadd6855af"' }>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostgresAuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostgresAuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostgresService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostgresService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChatModule.html" data-type="entity-link" >ChatModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CSurfMiddleware.html" data-type="entity-link" >CSurfMiddleware</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmailModule.html" data-type="entity-link" >EmailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EmailModule-66302951fe538bf59127cc635d2f8b2f62027a521334648440f5e913e875ae8cde261d9decfb857df3b23c9dd5d1c5edf62fa31b0832e602c70137a92bb7b92a"' : 'data-bs-target="#xs-injectables-links-module-EmailModule-66302951fe538bf59127cc635d2f8b2f62027a521334648440f5e913e875ae8cde261d9decfb857df3b23c9dd5d1c5edf62fa31b0832e602c70137a92bb7b92a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmailModule-66302951fe538bf59127cc635d2f8b2f62027a521334648440f5e913e875ae8cde261d9decfb857df3b23c9dd5d1c5edf62fa31b0832e602c70137a92bb7b92a"' :
                                        'id="xs-injectables-links-module-EmailModule-66302951fe538bf59127cc635d2f8b2f62027a521334648440f5e913e875ae8cde261d9decfb857df3b23c9dd5d1c5edf62fa31b0832e602c70137a92bb7b92a"' }>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link" >AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link" >LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewPasswordDTO.html" data-type="entity-link" >NewPasswordDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewPasswordResponseDTO.html" data-type="entity-link" >NewPasswordResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordRecoveryDTO.html" data-type="entity-link" >PasswordRecoveryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDTO.html" data-type="entity-link" >SignUpDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpResponseDTO.html" data-type="entity-link" >SignUpResponseDTO</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthService.html" data-type="entity-link" >JwtAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostgresAuthService.html" data-type="entity-link" >PostgresAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostgresService.html" data-type="entity-link" >PostgresService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestLoggerMiddleware.html" data-type="entity-link" >RequestLoggerMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformInterceptor.html" data-type="entity-link" >TransformInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/HttpExceptionResponse.html" data-type="entity-link" >HttpExceptionResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthRequest.html" data-type="entity-link" >IAuthRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITokenPayload.html" data-type="entity-link" >ITokenPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserAuth.html" data-type="entity-link" >IUserAuth</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordRecoveryProps.html" data-type="entity-link" >PasswordRecoveryProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignUpEmailProps.html" data-type="entity-link" >SignUpEmailProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StandardResponse.html" data-type="entity-link" >StandardResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});